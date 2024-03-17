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
		this.Enemys = [];
		this.waveMaxNumberOfEnemys=5;
		this.waveNumberOfEnemysSpawned=0;
	}

	//Déclenche la 1ère vague. Lancer cette fonction réitialise donc les ennemis.
	firstWave() {
		this.waveNumber = 1;
		this.waveMaxNumberOfEnemys =
			((WavesManager.EnemyBuffer * this.difficulty) / 2 + 1) | 0;
		this.waveNumberOfEnemysSpawned = 0;
		Entity.speedMultiplier = Entity.speedMultiplierDefault;
		for (
			let i = 0;
			i < WavesManager.EnemyBuffer * this.difficulty;
			i++
		) {
			this.Enemys[i] = new Enemy(
				Entity.canvasWidth + getRandomInt(WavesManager.maxRandomSpawnDistance) +
					WavesManager.spawnDistance,
				getRandomInt(Entity.canvasHeight - Enemy.height - Enemy.spawnOffset) + Enemy.spawnOffset,
				this.difficulty
				);
			this.Enemys[i].index = i;
			this.waveNumberOfEnemysSpawned++;
			if (
				this.waveNumberOfEnemysSpawned >
				this.waveMaxNumberOfEnemys
			) {
				this.Enemys[i].die();
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
		Entity.speedMultiplier;
		this.waveNumber++;
		this.waveNumberOfEnemysSpawned = 0;
		//a vitesse du jeu augmente à chaque complétion d'une vague
		Entity.addToSpeed(0.01 * this.difficulty);
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
		for (let a = 0; a < this.Enemys.length; a++) {
			this.Enemys[a].fate(this);
		}
	}

	//Gêre le mise à jour des vagues
	wavesUpdates(players,entitySpeedMultiplier) {
		this.updateEnnemiesToPlayersInteractions(players);
		//Renvoie un boolean en fonction de si la vague est finie (tous les ennemis ont disparues).
		return this.updateAllEnemy(entitySpeedMultiplier);
	}

	updateEnnemiesToPlayersInteractions(playerMap){
		const iterator = playerMap.entries();
        let entry;
        for(let i=0; i<playerMap.size; i++){
            entry = iterator.next();
            if(entry.value!=null){
                const player = entry.value[1];
				for (let a = 0; a < this.Enemys.length; a++) {
					this.Enemys[a].EnemyShotsCollideWithPlayer(player);
					if (!this.Enemys[a].isDead && (player.alive && !player.invincible)) {
						if (this.Enemys[a].isCollidingWith(player)) {
							player.die();
							this.Enemys[a].fate(this);
						}
						player.playerShotsCollideWithEnemy(this.Enemys[a]);
					}
				}
            }
        }
	}

	
	//Renvoie un boolean en fonction de si la vague est finie (tous les ennemis ont disparues).
	updateAllEnemy(entitySpeedMultiplier){
		let allDead = true;
		for (let a = 0; a < this.Enemys.length; a++) {
			this.Enemys[a].updateShots(entitySpeedMultiplier);
			if (!this.Enemys[a].isDead) {
				allDead = false;
				this.Enemys[a].update(entitySpeedMultiplier);
			}
		}
		return allDead;
	}
}