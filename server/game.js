import GameData from "./gameData.js";
import Player from "./player.js";
import Entity from "./entity.js";
import WavesManager from "./wavesManager.js";

export default class Game{
	constructor(io,difficulty) {
        this.io=io;
        this.difficulty=difficulty;
        this.wavesManager = new WavesManager();
        this.gameData = new GameData();
        this.players = new Map();
        this.teamLifes = Player.defaultNumberOfLife;
        this.isInGame = true;
        this.time = 0;
        this.allDead=false;
	}

    init(){    
        setInterval(this.update.bind(this), 1000 / 60);
        setInterval(this.updateHUD, 1000);
        this.wavesManager.firstWave(Entity.canvasWidth, Entity.canvasHeight);
    }

    resetTeamLives() {
		this.teamLifes = Player.defaultNumberOfLife;
	}

	addToTeamLives(n) {
		this.teamLifes += n;
	}

	atLeast1PlayerAlive(){
		const iterator = this.players.entries();
        let entry;
        for(let i=0; i<map.size; i++){
            entry = iterator.next();
            if(entry.value!=null){
                if(entry.value[1].alive){
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
                        entry.value[1].score+=1; // WavesManager.difficulty
                    }
                }
            }
            this.time++;
            //Vitesse du jeu augmente au fur et à mesure
            this.addToSpeed(0.001); // WavesManager.difficulty
            this.io.emit('time',time);
        }
    }

    
	addToSpeed(modifyer){
		this.gameData.entitySpeedMultiplier=Math.round((this.gameData.entitySpeedMultiplier+modifyer)*1000)/1000
		if(this.gameData.entitySpeedMultiplier>Entity.speedMultiplierMAX){
			this.gameData.entitySpeedMultiplier=Entity.speedMultiplierMAX;
		}
	}

	setSpeed(newSpeed){
		this.gameData.entitySpeedMultiplier=Math.round((newSpeed)*1000)/1000;
	}

    
    update() {
        this.io.emit('playerKeys');
        this.updatePlayersAndPlayerShots();
        this.io.emit('game',this.gameData);

        //WaveUpdate smet à jour tous ce qui est en rapport avec les ennmies, notamment les collisions, la mort du jouer, etc...
        this.allDead = this.wavesManager.wavesUpdates(this.players,this.gameData.entitySpeedMultiplier); 

        if (this.allDead) {
            //Si la vague est finie, on passe à la prochaine.
            //wavesManager.nextWave();
            /*if (WavesManager.waveNumber % (WavesManager.difficultyMax + 1 - WavesManager.difficulty) == 0) {
                Power.powers.push(
                    new Power(
                        canvas.width,
                        getRandomInt(canvas.height - Power.radius * 2) + Power.radius
                    )
                );
            }*/
        }
    }

    updatePlayersAndPlayerShots(){
        this.gameData.players=[];
        this.gameData.shots=[];
        const iterator = this.players.entries();
    
        let entry;
        for(let i=0; i<this.players.size; i++){
            entry = iterator.next();
            if(entry.value!=null){
                const player = entry.value[1];
                this.gameData.players.push({"id":entry.value[0],"posX":player.posX,"posY":player.posY,"score":player.score});
                for(let i=0; i<player.shots.length;i++){
                    this.gameData.shots.push({"posX":player.shots[i].posX,"posY":player.shots[i].posY,"isFromAPlayer":true,"perforation":player.shots[i].perforation});
                }
            }
        }
    }

    updateWaves(number){
        this.wavesNumber=number;
    }

    updateEnnemies(){
        
    }
}
