import GameData from './gameData.js';
import Player from './player.js';
import Entity from './entity.js';
import WavesManager from './wavesManager.js';
import Power from './power.js';
import { getRandomInt } from './utils.js';
import DataCSV from './dataCSV.js';

const csvdata = new DataCSV();

export default class Game {
	static difficultyMax = 4;

	constructor(io, difficulty) {
		this.io = io;
		this.difficulty = difficulty;
		this.wavesManager = new WavesManager();
		this.gameData = new GameData();
		this.players = new Map();
		this.powers = [];
		this.teamLifes = Player.defaultNumberOfLife - this.difficulty;
		if (this.teamLifes < 0) this.teamLifes = 0;
		this.isInGame = false;
		this.time = 0;
		this.allDead = false;
		this.idIntervalUpdate;
		this.idIntervalUpdateHUD;
	}

	init() {
		this.wavesManager.firstWave(this.difficulty);
		this.idIntervalUpdate = setInterval(this.update.bind(this), 1000 / 60);
		this.idIntervalUpdateHUD = setInterval(this.updateHUD.bind(this), 1000);
	}

	resetTeamLives() {
		this.teamLifes = Player.defaultNumberOfLife;
	}

	addToTeamLives(n) {
		this.teamLifes += n;
	}

	atLeast1PlayerAlive() {
		const iterator = this.players.entries();
		let entry;
		for (let i = 0; i < this.players.size; i++) {
			entry = iterator.next();
			if (entry.value != null) {
				if (entry.value[1].alive) {
					return true;
				}
			}
		}
		return false;
	}

	//Ajoute au fur et à mesure des points aux joueurs et ajoute de la vitesse au jeu
	updateHUD() {
		if (this.isInGame) {
			const iterator = this.players.entries();
			let entry;
			for (let i = 0; i < this.players.size; i++) {
				entry = iterator.next();
				if (entry.value != null) {
					if (entry.value[1].alive) {
						entry.value[1].score += this.difficulty;
					}
				}
			}
			this.time++;
			//Vitesse du jeu augmente au fur et à mesure
			this.addToSpeed(0.001 * this.difficulty);
			this.io.emit('time', this.time);
		}
	}

	addToSpeed(modifyer) {
		this.gameData.entitySpeedMultiplier =
			Math.round((this.gameData.entitySpeedMultiplier + modifyer) * 1000) /
			1000;
		if (this.gameData.entitySpeedMultiplier > Entity.speedMultiplierMAX) {
			this.gameData.entitySpeedMultiplier = Entity.speedMultiplierMAX;
		}
	}

	addToSpeed(modifyer) {
		this.gameData.entitySpeedMultiplier =
			Math.round((this.gameData.entitySpeedMultiplier + modifyer) * 1000) /
			1000;
		if (this.gameData.entitySpeedMultiplier > Entity.speedMultiplierMAX) {
			this.gameData.entitySpeedMultiplier = Entity.speedMultiplierMAX;
		}
	}

	update() {
		this.resetData();
		this.io.emit('playerKeys'); //Permet d'update les joueurs et leurs tirs
		this.checkPlayerRespawn();
		
		this.updateAllPowers();

		//WaveUpdate se met à jour tous ce qui est en rapport avec les enemies, notamment les collisions, la mort du jouer, etc...
		this.allDead = this.wavesManager.wavesUpdates(
			this,
			this.gameData.entitySpeedMultiplier
		);
		if (this.allDead) {
			//Si la vague est finie, on passe à la prochaine.
			this.wavesManager.nextWave(this.difficulty);
			this.addToSpeed(0.01 * this.difficulty);

			if (
				this.wavesManager.waveNumber %
					(Game.difficultyMax + 1 - this.difficulty) ==
				0
			) {
				this.powers.push(
					new Power(
						Entity.canvasWidth,
						getRandomInt(Entity.canvasHeight - Power.height)
					)
				);
			}
			this.refreshWaves();
		} else {
			this.refreshEnnemiesAndEnemyShots();
		}
		this.refreshPlayersAndPlayerShots(); //Rafraichis gameData avec les nouvelles données des joueurs et de leurs tirs pour pouvoir les envoyer aux clients
		this.refreshPowers();
		this.refreshLifes();
		this.refreshIsInGame();
		if (this.teamLifes <= 0 && !this.atLeast1PlayerAlive()) {
			this.isInGame = false;
		}
		this.io.emit('game', this.gameData);
	}

	resetData() {
		this.gameData.players = []; //{"id":'',"posX":x,"posY:y","score":0,"invincible":4} //Invincible est le timer avant la fin de l'invinciblité
		this.gameData.enemys = []; //{"id":'',"posX":x,"posY:y","type":'red',"lifes":1}
		this.gameData.powers = []; //{"posX":x,"posY:y","type":'life'}
		this.gameData.shots = []; //{"posX":x,"posY:y","isFromAPlayer":true,"perforation":false}
	}

	restartGame() {
		this.gameData.players = []; //{"id":'',"posX":x,"posY:y","score":0,"invincible":4} //Invincible est le timer avant la fin de l'invinciblité
		this.gameData.enemys = []; //{"id":'',"posX":x,"posY:y","type":'red',"lifes":1}
		this.gameData.powers = []; //{"posX":x,"posY:y","type":'life'}
		this.gameData.shots = []; //{"posX":x,"posY:y","isFromAPlayer":true,"perforation":false,"tick":0}
		this.gameData.wavesNumber = 1;
		this.gameData.teamLifes = 1;
		this.gameData.entitySpeedMultiplier = 1;
		this.gameData.isInGame = true;
	}

	refreshPlayersAndPlayerShots() {
		const iterator = this.players.entries();
		let entry;
		for (let i = 0; i < this.players.size; i++) {
			entry = iterator.next();
			if (entry.value != null) {
				const player = entry.value[1];
				if (player.alive)
					this.gameData.players.push({
						id: entry.value[0],
						posX: player.posX,
						posY: player.posY,
						score: player.score,
						pseudo: player.pseudo,
						invincible: player.timerBeforeLosingInvincibility,
					});
				let shot;
				for (let i = 0; i < player.shots.length; i++) {
					shot = player.shots[i];
					if (shot.active)
						this.gameData.shots.push({
							posX: shot.posX,
							posY: shot.posY,
							isFromAPlayer: true,
							perforation: shot.perforation,
							laser: shot.laser,
							tick: shot.tickActive
						});
				}
			}
		}
	}

	updateAllPowers() {
		for (let i = 0; i < this.powers.length; i++) {
			this.powers[i].update(this.gameData.entitySpeedMultiplier);
			if (this.powers[i].posX < 0 - Power.width) {
				this.powers.shift();
			} else if (this.powers[i].active) {
				const iterator = this.players.entries();
				let entry;
				for (let p = 0; p < this.players.size; p++) {
					entry = iterator.next();
					if (entry.value != null && entry.value[1].alive) {
						if (this.powers[i].isCollidingWith(entry.value[1])) {
							this.powers[i].active = false;
							this.powers[i].powerActivation(this, entry.value[1]);
							this.io.emit('playSound','power');
						}				
					}
				}
			}
		}
	}

	refreshWaves() {
		this.gameData.wavesNumber = this.wavesManager.waveNumber;
	}

	refreshLifes() {
		this.gameData.teamLifes = this.teamLifes;
	}

	refreshIsInGame() {
		this.gameData.isInGame = this.isInGame;
	}

	refreshEnnemiesAndEnemyShots() {
		let enemys = this.wavesManager.enemys;
		let refreshed = this.gameData.enemys;
		for (let i = 0; i < enemys.length; i++) {
			if (!enemys[i].isDead)
				refreshed.push({
					id: i,
					posX: enemys[i].posX,
					posY: enemys[i].posY,
					type: enemys[i].type,
					lifes: enemys[i].lifes,
				});
			for (let s = 0; s < enemys[i].shots.length; s++) {
				if (enemys[i].shots[s].active)
					this.gameData.shots.push({
						posX: enemys[i].shots[s].posX,
						posY: enemys[i].shots[s].posY,
						isFromAPlayer: false,
						perforation: enemys[i].shots[s].perforation,
						laser: false, //enemys[i].shots[s].laser
						tick: enemys[i].shots[s].tickActive
					});
			}
		}
	}

	refreshPowers() {
		for (let i = 0; i < this.powers.length; i++) {
			if (this.powers[i].active) {
				this.gameData.powers[i] = {
					posX: this.powers[i].posX,
					posY: this.powers[i].posY,
					type: this.powers[i].type,
				};
			}
		}
	}

	checkPlayerRespawn() {
		const iterator = this.players.entries();
		let entry;
		for (let i = 0; i < this.players.size; i++) {
			entry = iterator.next();
			if (entry.value != null) {
				if (!entry.value[1].alive) {
					if (entry.value[1].timerBeforeRespawn <= 0) {
						entry.value[1].respawn(this.difficulty);
					} else {
						entry.value[1].timerBeforeRespawn--;
					}
				}
			}
		}
	}
	destroy() {
		clearInterval(this.idIntervalUpdate);
		clearInterval(this.idIntervalUpdateHUD);
		this.powers = [];
		this.teamLifes = Player.defaultNumberOfLife - this.difficulty;
		if (this.teamLifes < 0) this.teamLifes = 0;
		this.time = 0;
		this.allDead = false;
		this.wavesManager = new WavesManager();
		this.wavesManager.firstWave(this.difficulty);
		this.idIntervalUpdate = setInterval(this.update.bind(this), 1000 / 60);
		this.idIntervalUpdateHUD = setInterval(this.updateHUD.bind(this), 1000);
		this.restartGame();
		this.isInGame = true;
		this.io.emit('game', this.gameData);
	}
}
