import GameData from "./gameData.js";
import Player from "./player.js";
import Entity from "./entity.js";
import WavesManager from "./wavesManager.js";
import Power from './power.js';
import {getRandomInt} from './utils.js';

export default class Game{

    static difficultyMax = 4;

	constructor(io,difficulty) {
        this.io=io;
        this.difficulty=difficulty;
        this.wavesManager = new WavesManager();
        this.gameData = new GameData();
        this.players = new Map();
        this.powers = [];
        this.teamLifes = Player.defaultNumberOfLife;
        this.isInGame = true;
        this.time = 0;
        this.allDead=false;
	}

    init(){    
        setInterval(this.update.bind(this), 1000 / 60);
        setInterval(this.updateHUD, 1000);
        this.wavesManager.firstWave(this.difficulty);
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
		for (let i = 0; i < map.size; i++) {
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
            for(let i=0; i<this.players.size; i++){
                entry = iterator.next();
                if(entry.value!=null){
                    if(entry.value[1].alive){
                        entry.value[1].score+=this.difficulty;
                    }
                }
            }
            this.time++;
            //Vitesse du jeu augmente au fur et à mesure
            this.addToSpeed(0.001*this.difficulty);
            this.io.emit('time',time);
        }
    }

    
	addToSpeed(modifyer){
		this.gameData.entitySpeedMultiplier=Math.round((this.gameData.entitySpeedMultiplier+modifyer)*1000)/1000
		if(this.gameData.entitySpeedMultiplier>Entity.speedMultiplierMAX){
			this.gameData.entitySpeedMultiplier=Entity.speedMultiplierMAX;
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
		this.refreshPowers();
        this.checkPlayerRespawn();
        this.refreshPlayersAndPlayerShots(); //Rafraichis gameData avec les nouvelles données des joueurs et de leurs tirs pour pouvoir les envoyer aux clients
       
		this.updateAllPowers();

        //WaveUpdate smet à jour tous ce qui est en rapport avec les ennmies, notamment les collisions, la mort du jouer, etc...
        this.allDead = this.wavesManager.wavesUpdates(this.players,this.gameData.entitySpeedMultiplier); 
        if (this.allDead) {
            //Si la vague est finie, on passe à la prochaine.
            this.wavesManager.nextWave(this.difficulty);
            this.addToSpeed(0.01 * this.difficulty);
		
            if (this.wavesManager.waveNumber % (Game.difficultyMax + 1 - this.difficulty) == 0) {
				this.powers.push(
                    new Power(
                        Entity.canvasWidth,  getRandomInt(Entity.canvasHeight - Power.height)
                    )
                );
            }
            this.refreshWaves();
        }else{
            this.refreshEnnemiesAndEnemyShots();
        }
        this.io.emit('game',this.gameData);
    }

	resetData() {
		this.gameData.players = []; //{"id":'',"posX":x,"posY:y","score":0}
		this.gameData.enemys = []; //{"posX":x,"posY:y","type":'red',"lifes":1}
		this.gameData.powers = []; //{"posX":x,"posY:y","type":'life'}
		this.gameData.shots = []; //{"posX":x,"posY:y","isFromAPlayer":true,"perforation":false}
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
						invincible: player.invincible,
					});
				for (let i = 0; i < player.shots.length; i++) {
					if (player.shots[i].active)
						this.gameData.shots.push({
							posX: player.shots[i].posX,
							posY: player.shots[i].posY,
							isFromAPlayer: true,
							perforation: player.shots[i].perforation,
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
			}else if(this.powers[i].active){
				const iterator = this.players.entries();
        		let entry;
        		for(let i=0; i<this.players.size; i++){
            		entry = iterator.next();
            		if(entry.value!=null && entry.value[1].alive){
                		this.powers[i].powerActivation(this,entry.value[1]);
            		}
        		}
			}
			
			
		}
	}

	refreshWaves() {
		this.gameData.wavesNumber = this.wavesManager.waveNumber;
	}

	refreshEnnemiesAndEnemyShots() {
		let enemys = this.wavesManager.enemys;
		let refreshed = this.gameData.enemys;
		for (let i = 0; i < enemys.length; i++) {
			if (!enemys[i].isDead)
				refreshed.push({
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
					});
			}
		}
	}

	refreshPowers(){
		for(let i = 0; i<this.powers.length; i++){
			if(this.powers[i].active){
				this.gameData.powers[i]={"posX":this.powers[i].posX,"posY":this.powers[i].posY,"type":this.powers[i].type};
			}
		}
	}

    checkPlayerRespawn(){
        const iterator = this.players.entries();
        let entry;
        for(let i=0; i<this.players.size; i++){
            entry = iterator.next();
            if(entry.value!=null){
                if(!entry.value[1].alive){
                    if (entry.value[1].timerBeforeRespawn <= 0) {
                        entry.value[1].respawn(this.difficulty);
                        this.teamLifes--;
                    }else{
                        entry.value[1].timerBeforeRespawn--;
                    }
                }
                
            }
        }
    }
}
