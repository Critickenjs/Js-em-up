import Entity from './entity.js';
import Ennemy from './ennemy.js';
import { getRandomInt } from './utils.js';

export default class WavesManager {
	//Difficulty
	static difficultyMax = 4;
	//static difficulty = 0;
	
	// Nombre max d'ennemis pouvant apparaitre à l'écran. A ajuster en fonction des lags.
	static ennemyBuffer = 5;

	//Waves
	//static waveMaxNumberOfEnnemys = 5;
	//static waveNumberOfEnnemysSpawned = 0;
	//static waveNumber = 1;
	static waveMultiplier = 1;
	static maxRandomSpawnDistance = 400;
	static spawnDistance = 100;

	constructor() {
		this.difficulty = 1;
		this.waveNumber = 1;
		this.ennemys = [];
		this.waveMaxNumberOfEnnemys=5;
		this.waveNumberOfEnnemysSpawned=0;
	}

	//Déclenche la 1ère vague. Lancer cette fonction réitialise donc les ennemis.
	firstWave() {
		this.waveNumber = 1;
		this.waveMaxNumberOfEnnemys =
			((WavesManager.ennemyBuffer * this.difficulty) / 2 + 1) | 0;
		this.waveNumberOfEnnemysSpawned = 0;
		Entity.speedMultiplier = Entity.speedMultiplierDefault;
		for (
			let i = 0;
			i < WavesManager.ennemyBuffer * this.difficulty;
			i++
		) {
			this.ennemys[i] = new Ennemy(
				Entity.canvasWidth + getRandomInt(WavesManager.maxRandomSpawnDistance) +
					WavesManager.spawnDistance,
				getRandomInt(Entity.canvasHeight - Ennemy.height - Ennemy.spawnOffset) + Ennemy.spawnOffset,
				this.difficulty
				);
			this.ennemys[i].index = i;
			this.waveNumberOfEnnemysSpawned++;
			if (
				this.waveNumberOfEnnemysSpawned >
				this.waveMaxNumberOfEnnemys
			) {
				this.ennemys[i].die();
			}
		}
		console.log(
			'Vague n°' +
				this.waveNumber +
				' : ' +
				this.waveMaxNumberOfEnnemys +
				' ennemies.'
		);
	}

	//Appelle la vague suivante
	nextWave() {
		Entity.speedMultiplier;
		this.waveNumber++;
		this.waveNumberOfEnnemysSpawned = 0;
		//a vitesse du jeu augmente à chaque complétion d'une vague
		Entity.addToSpeed(0.01 * this.difficulty);
		console.log(
			'Vague n°' +
				this.waveNumber +
				' : ' +
				this.waveMaxNumberOfEnnemys +
				' ennemies.'
		);
		this.waveMaxNumberOfEnnemys =
			((3 +
				this.difficulty +
				getRandomInt(this.difficulty) +
				this.waveNumber / 2) *
				WavesManager.waveMultiplier) |
			0; // | 0 convertit en 'int' (permet d'éviter les chiffres à virgules).
		for (let a = 0; a < this.ennemys.length; a++) {
			this.ennemys[a].fate(this);
		}
	}

	//Gêre le mise à jour des vagues
	wavesUpdates(players,entitySpeedMultiplier) {
		this.updateEnnemiesToPlayersInteractions(players);
		//Renvoie un boolean en fonction de si la vague est finie (tous les ennemis ont disparues).
		return this.updateAllEnnemy(entitySpeedMultiplier);
	}

	updateEnnemiesToPlayersInteractions(playerMap){
		const iterator = playerMap.entries();
        let entry;
        for(let i=0; i<playerMap.size; i++){
            entry = iterator.next();
            if(entry.value!=null){
                const player = entry.value[1];
				for (let a = 0; a < this.ennemys.length; a++) {
					this.ennemys[a].ennemyShotsCollideWithPlayer(player);
					if (!this.ennemys[a].isDead && (player.alive && !player.invincible)) {
						if (this.ennemys[a].isCollidingWith(player)) {
							player.die();
							this.ennemys[a].fate(this);
						}
						player.playerShotsCollideWithEnnemy(this.ennemys[a]);
					}
				}
            }
        }
	}

	
	//Renvoie un boolean en fonction de si la vague est finie (tous les ennemis ont disparues).
	updateAllEnnemy(entitySpeedMultiplier){
		let allDead = true;
		for (let a = 0; a < this.ennemys.length; a++) {
			this.ennemys[a].updateShots(entitySpeedMultiplier);
			if (!this.ennemys[a].isDead) {
				allDead = false;
				this.ennemys[a].update(entitySpeedMultiplier);
			}
		}
		return allDead;
	}
}