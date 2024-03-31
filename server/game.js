import GameData from './gameData.js';
import Player from './player.js';
import Entity from './entity.js';
import WavesManager from './wavesManager.js';
import Power from './power.js';
import { getRandomInt } from './utils.js';
import DataCSV from './dataCSV.js';

export default class Game {
	static difficultyMax = 4;

	constructor(difficulty) {
		this.csvdata = new DataCSV();
		this.difficulty = difficulty;
		this.wavesManager = new WavesManager();
		this.gameData = new GameData();
		this.players = new Map();
		this.powers = [];
		this.resetTeamLives();
		this.isInGame = false;
		this.time = 0;
		this.allDead = false;
		this.gameOverData = [];
	}

	init() {
		this.wavesManager.firstWave(this.difficulty);
		this.isInGame = true;
	}

	resetTeamLives() {
		this.gameData.teamLifes = Player.defaultNumberOfLife - this.difficulty;
		if (this.gameData.teamLifes < 1) this.gameData.teamLifes = 1; //Reset à 1; pas à 0, car même si 0 est le min, de toute manière la vie est déduite à la mort donc théoriquement ça change rien mais pratiquement si on met 0 ça crash le restart donc metre absolument à 1.
	}

	resetPlayers() {
		const iterator = this.players.entries();
		let entry;
		for (let i = 0; i < this.players.size; i++) {
			entry = iterator.next();
			if (entry.value != null) {
				entry.value[1].score = 0;
				entry.value[1].kills = 0;
				entry.value[1].time = 0;

				entry.value[1].shots = [];
				entry.value[1].timerBeforeShots = 0;

				entry.value[1].maxTimeBeforeRespawn = 100;
				entry.value[1].timerBeforeRespawn = 0;

				entry.value[1].timerBeforeLosingIceMalus = 0;
				entry.value[1].iceMultiplierMalus = 1;

				entry.value[1].timerBeforeLosingScoreMultiplierBonus = 0;
				entry.value[1].scoreMultiplierBonus = 1;

				entry.value[1].timerBeforeLosingPerforationBonus = 0;
				entry.value[1].timerBeforeLosingLaserBonus = 0;
			}
		}
	}

	addToTeamLives(n) {
		this.gameData.teamLifes += n;
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
						entry.value[1].time++;
					}
				}
			}
			this.time++;
			if (this.time % (((Power.frequencyPowerSpawn / this.difficulty) + this.difficulty) | 0) == 0) {
				this.powers.push(
					new Power(
						Entity.canvasWidth,
						getRandomInt(Entity.canvasHeight - Power.height)
					)
				);
			}
			//Vitesse du jeu augmente au fur et à mesure
			this.addToSpeed(0.001 * this.difficulty);
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

			//Envoyer des pouvoirs en fonctions des vagues
			/*if (this.wavesManager.waveNumber %(Game.difficultyMax + 1 - this.difficulty) ==
				0
			) {
				this.powers.push(
					new Power(
						Entity.canvasWidth,
						getRandomInt(Entity.canvasHeight - Power.height)
					)
				);
			}*/
			this.refreshWaves();
		} else {
			this.refreshEnnemiesAndEnemyShots();
		}
		this.refreshPlayersAndPlayerShots(); //Rafraichis gameData avec les nouvelles données des joueurs et de leurs tirs pour pouvoir les envoyer aux clients
		this.refreshPowers();
		this.refreshIsInGame();
		if (this.gameData.teamLifes < 1 && !this.atLeast1PlayerAlive()) {
			if (this.isInGame) {
				this.gameOverData = [];
				const iterator = this.players.entries();
				let entry;
				for (let i = 0; i < this.players.size; i++) {
					entry = iterator.next();
					if (entry.value != null) {
						this.gameOverData.push({ "id": entry.value[0], "pseudo": entry.value[1].pseudo, "score": entry.value[1].score, "kills": entry.value[1].kills, "time": entry.value[1].time });
						this.csvdata.writeCSV({ [entry.value[1].pseudo || 'Jonesy Smith']: entry.value[1].score }); //Ajoute 1 ligne au CSV pour chaque joueur dans la partie.
					}
				}

			}
			this.isInGame = false;
		}
	}

	resetData() {
		this.gameData.resetData();
	}

	resetAllData() {
		this.gameData.resetAllData();
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
						scoreMultiplier: player.scoreMultiplierBonus
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
							tick: shot.tickActive,
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
						}
					}
				}
			}
		}
	}

	refreshWaves() {
		this.gameData.wavesNumber = this.wavesManager.waveNumber;
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
						tick: enemys[i].shots[s].tickActive,
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
						entry.value[1].timerBeforeRespawn = 0;
						if (this.gameData.teamLifes >= 1) entry.value[1].respawn(this.difficulty);
					} else {
						entry.value[1].timerBeforeRespawn--;
					}
				}
			}
		}
	}

	// Ces deux fonctions étaient précédemment destroy()

	restartGame() {
		this.resetAllData();
		this.resetTeamLives(); //!\\ Important : doit être appelé après resetAllData()
		this.isInGame = true;
		this.allDead = false;
		this.powers = [];
		this.time = 0;
		this.wavesManager = new WavesManager();
		this.csvdata = new DataCSV();
		this.init();
		this.resetPlayers();
	}
	//


}
