import Entity from './entity.js';
import Shot from './shot.js';
import { getRandomInt, getRandomIntWithMin } from './utils.js';
import WavesManager from './wavesManager.js';

export default class Enemy extends Entity {
	//Les variables de gameplay
	static width = 40;
	static height = 40;
	static types = ['red', 'purple', 'orange', 'darkred']; //'boss' n'est pas à mettre dans la liste
	static bulletSpeed = Shot.defaultSpeed;

	static bossFrequency = 5;

	//Paramétrage technique
	static spawnOffset = 45; // pour éviter que les ennemis spawnent aux bords de l'écran et empietent sur le HUD.

	constructor(posX, posY, difficulty) {
		super(posX, posY, Enemy.width, Enemy.height);
		this.index = -1;
		this.isDead = false;
		this.type = 'red';
		this.lifes = 1;
		this.value = 10;
		this.shootTimer = (100 + 60 / difficulty) | 0;
		this.applyType();
		this.shots = [];
		this.timeBeforeNextShoot = this.shootTimer;
		this.difficulty = difficulty;
	}

	//Mettre à jour les tirs causés par l'ennemi.
	updateShots(entitySpeedMultiplier) {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].update(entitySpeedMultiplier);
			if (this.shots[i].posX < 0) {
				this.shots.shift();
			}
		}
	}

	//metre à jour l'ennemi
	update(waveManager, entitySpeedMultiplier) {
		super.update(entitySpeedMultiplier);
		if (this.posX < 0 - this.width) {
			this.fate(waveManager);
			//Pour permettre la perte de points en cas d'ennemis qui aurait réussi à passer les joueurs, c'est ici
			//Mais pour cela il faudrait créer les joueurs en static dans joueur plutot qu'en dur dans main.
		}
		if (this.posY < 0) {
			this.speedY = Math.abs(this.speedY);
		} else if (this.posY > Entity.canvasHeight - this.height) {
			this.speedY = -this.speedY;
		}
		if (
			(this.type == 'orange' || this.type == 'boss') &&
			this.posX < Entity.canvasWidth * 1.2
		) {
			this.timeBeforeNextShoot--;
			if (this.timeBeforeNextShoot <= 0) {
				this.shoot();
				this.timeBeforeNextShoot = this.shootTimer;
			}
		}
	}

	die() {
		this.isDead = true;
	}

	// La fonction se lance en cas de contact avec une balle d'un joueur.
	// Donne la possibilité aux ennemis d'avoirs plusieurs points de vie et de ne pas mourir instantanément.
	getHurt(waveManager) {
		//Retourne true si l'ennemi meurt et false sinon.'
		this.lifes--;
		if (this.lifes <= 0) {
			this.fate(waveManager);
			return true;
		} else if (this.type == 'darkred') {
			this.height = (Enemy.height * (this.lifes / 1.3)) | 0;
			this.width = (Enemy.width * (this.lifes / 1.3)) | 0;
			this.posX += this.width / 3;
			this.posY += this.height / 3;
		}
		return false;
	}

	// Détermine si l'ennemi meurt (se met en attentte de la prochaine manche)
	// ou respawn (si la manche en cours n'est pas finie et qu'il reste des ennemies à faire apparaître).
	fate(waveManager) {
		if (
			waveManager.waveNumberOfEnemysSpawned < waveManager.waveMaxNumberOfEnemys
		) {
			this.respawn(waveManager);
		} else {
			this.die();
		}
	}

	respawn(wavesManager) {
		wavesManager.waveNumberOfEnemysSpawned++;
		if (
			wavesManager.waveNumber % Enemy.bossFrequency == 0 &&
			!wavesManager.hasABoss
		) {
			this.reset('boss');
			wavesManager.hasABoss = true;
		} else {
			this.reset();
		}
	}

	reset(type = Enemy.types[getRandomInt(Enemy.types.length)]) {
		this.isDead = false;
		this.type = type;
		this.posX =
			Entity.canvasWidth +
			getRandomInt(WavesManager.maxRandomSpawnDistance) +
			WavesManager.spawnDistance;
		this.applyType();
		if (this.type == 'darkred') {
			this.posY =
				getRandomInt(
					Entity.canvasHeight - Enemy.height * this.lifes - Enemy.spawnOffset
				) + Enemy.spawnOffset;
		} else {
			this.posY =
				getRandomInt(Entity.canvasHeight - this.height - Enemy.spawnOffset) +
				Enemy.spawnOffset;
		}
	}

	// Applique les particularités et différences entre chaque types d'ennemis.
	// Les red vont tout droit à une vitesse variable, ce sont les plus rapides.
	// Les purple se déplacent en diagonale, ce qui les rend plus difficile à viser.
	// Les orange se déplacent aussi e ndiagonale mais plus lentement, par contre ils tirent des projectiles mortel pour le joueur.
	// Les darkred vont lentement tout droits, ils sont plus gros que les red mais sont plus résistant.
	applyType() {
		this.height = Enemy.height;
		this.width = Enemy.width;
		this.lifes = 1;
		this.shootTimer = (100 + 60 / this.difficulty) | 0;
		switch (this.type) {
			case 'red':
				this.speedX = -getRandomIntWithMin(2, 3);
				this.speedY = 0;
				this.value = 10;
				break;
			case 'purple':
				this.speedX = -getRandomIntWithMin(1, 2);
				this.speedY = 5;
				this.value = 12;
				break;
			case 'orange':
				this.height = Enemy.height * 1.8;
				this.width = Enemy.width * 1.8;
				this.speedX = -getRandomIntWithMin(1, 2);
				this.speedY = getRandomIntWithMin(-1, 1);
				this.value = 20;
				break;
			case 'darkred':
				this.posX =
					Entity.canvasWidth +
					getRandomInt(WavesManager.maxRandomSpawnDistance);
				this.lifes = 3;
				this.height = (Enemy.height * (this.lifes / 1.3)) | 0;
				this.width = (Enemy.width * (this.lifes / 1.3)) | 0;
				this.speedX = -1;
				this.speedY = 0;
				this.value = 25;
				break;
			case 'boss':
				this.lifes = 50;
				this.height = Enemy.height * 5;
				this.width = Enemy.width * 5;
				this.speedX = -0.9;
				this.speedY = getRandomIntWithMin(-1, 1);
				this.value = 50;
				this.shootTimer = (this.shootTimer / 2) | 0;
				break;
		}
	}

	shoot() {
		this.shots.push(
			new Shot(
				this.posX,
				this.posY + this.height / 2 - Shot.height / 2 - 5,
				false,
				-Enemy.bulletSpeed
			)
		);
	}

	//Collisions du joueur contre les tirs ennemis
	EnemyShotsCollideWithPlayer(game, player) {
		if (!player.invincible) {
			for (let s = 0; s < this.shots.length; s++) {
				if (this.shots[s].active) {
					if (this.shots[s].isCollidingWith(player)) {
						this.shots[s].active = false;
						if (player.alive) player.die(game);
					}
				}
			}
		}
	}
}
