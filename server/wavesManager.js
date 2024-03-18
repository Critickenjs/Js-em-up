import Entity from './entity.js';
import Enemy from './enemy.js';
import { getRandomInt } from './utils.js';

export default class WavesManager {
	//Difficulty
	static difficultyMax = 4;
	//static difficulty = 0;

	// Nombre max d'ennemis pouvant apparaitre à l'écran. A ajuster en fonction des lags.
	static EnemyBuffer = 5;

	//Waves
	//static waveMaxNumberOfEnemys = 5;
	//static waveNumberOfEnemysSpawned = 0;
	//static waveNumber = 1;
	static waveMultiplier = 1;
	static maxRandomSpawnDistance = 400;
	static spawnDistance = 100;

	constructor() {
		this.difficulty = 1;
		this.waveNumber = 1;
		this.enemys = [];
		this.waveMaxNumberOfEnemys = 5;
		this.waveNumberOfEnemysSpawned = 0;
	}

	//Déclenche la 1ère vague. Lancer cette fonction réitialise donc les ennemis.
	firstWave() {
		this.waveNumber = 1;
		this.waveMaxNumberOfEnemys =
			((WavesManager.EnemyBuffer * this.difficulty) / 2 + 1) | 0;
		this.waveNumberOfEnemysSpawned = 0;
		Entity.speedMultiplier = Entity.speedMultiplierDefault;
		for (let i = 0; i < WavesManager.EnemyBuffer * this.difficulty; i++) {
			this.enemys[i] = new Enemy(
				Entity.canvasWidth /*+ getRandomInt(WavesManager.maxRandomSpawnDistance) +
					WavesManager.spawnDistance*/,
				getRandomInt(Entity.canvasHeight - Enemy.height - Enemy.spawnOffset) +
					Enemy.spawnOffset,
				this.difficulty
			);
			this.enemys[i].index = i;
			this.waveNumberOfEnemysSpawned++;
			if (this.waveNumberOfEnemysSpawned > this.waveMaxNumberOfEnemys) {
				this.enemys[i].die();
			}
		}
		console.log(
			'Vague n°' +
				this.waveNumber +
				' : ' +
				this.waveMaxNumberOfEnemys +
				' ennemies.'
		);
	}

	//Appelle la vague suivante
	nextWave() {
		this.waveNumber++;
		this.waveNumberOfEnemysSpawned = 0;
		//a vitesse du jeu augmente à chaque complétion d'une vague
		console.log(
			'Vague n°' +
				this.waveNumber +
				' : ' +
				this.waveMaxNumberOfEnemys +
				' ennemies.'
		);
		this.waveMaxNumberOfEnemys =
			((3 +
				this.difficulty +
				getRandomInt(this.difficulty) +
				this.waveNumber / 2) *
				WavesManager.waveMultiplier) |
			0; // | 0 convertit en 'int' (permet d'éviter les chiffres à virgules).
		for (let a = 0; a < this.enemys.length; a++) {
			this.enemys[a].fate(this);
		}
	}

	//Gêre le mise à jour des vagues
	wavesUpdates(players, entitySpeedMultiplier) {
		this.updateEnnemiesToPlayersInteractions(players);
		//Renvoie un boolean en fonction de si la vague est finie (tous les ennemis ont disparues).
		return this.updateAllEnemy(entitySpeedMultiplier);
	}

	updateEnnemiesToPlayersInteractions(playerMap) {
		const iterator = playerMap.entries();
		let entry;
		for (let i = 0; i < playerMap.size; i++) {
			entry = iterator.next();
			if (entry.value != null) {
				for (let a = 0; a < this.enemys.length; a++) {
					this.enemys[a].EnemyShotsCollideWithPlayer(entry.value[1]);
					if (!this.enemys[a].isDead) {
						entry.value[1].playerShotsCollideWithEnemy(this, this.enemys[a]);
						if (entry.value[1].alive && !entry.value[1].invincible) {
							if (this.enemys[a].isCollidingWith(entry.value[1])) {
								entry.value[1].die();
								this.enemys[a].fate(this);
							}
						}
					}
				}
			}
		}
	}

	//Renvoie un boolean en fonction de si la vague est finie (tous les ennemis ont disparues).
	updateAllEnemy(entitySpeedMultiplier) {
		let allDead = true;
		for (let a = 0; a < this.enemys.length; a++) {
			this.enemys[a].updateShots(entitySpeedMultiplier);
			if (!this.enemys[a].isDead) {
				allDead = false;
				this.enemys[a].update(this, entitySpeedMultiplier);
			}
		}
		return allDead;
	}
}
