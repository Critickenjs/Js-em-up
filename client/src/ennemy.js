import { Entity } from './entity.js';
import { Shot } from './shot.js';
import { getRandomInt, getRandomIntWithMin } from './utils.js';
import { WavesManager } from './wavesManager.js';

export class Ennemy extends Entity {
	//Les variables de gameplay
	static width = 40;
	static height = 40;
	static types = ['red', 'purple', 'orange', 'darkred'];
	static bulletSpeed = Shot.defaultSpeed;
	static soundShotPath = './public/res/sounds/shotEnemy.mp3';

	//Paramétrage technique
	static spawnOffset = 45; // pour éviter que les ennemis spawnent aux bords de l'écran et empietent sur le HUD.

	constructor(posX, posY) {
		super(posX, posY, Ennemy.width, Ennemy.height);
		this.image = new Image();
		this.index = -1;
		this.isDead = false;
		this.type = 'red';
		this.lifes = 1;
		this.value = 10;
		this.applyType();
		this.shots = [];
		this.shootTimer = (100 + 60 / WavesManager.difficulty) | 0;
		this.timeBeforeNextShoot = this.shootTimer;
		this.soundShot = new Audio(Ennemy.soundShotPath);
	}

	

	//Afficher les tirs causés par un ennemi.
	renderShots(context) {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].render(context);
		}
	}

	//Mettre à jour les tirs causés par l'ennemi.
	updateShots() {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].update();
			if (this.shots[i].posX < 0) {
				this.shots.shift();
			}
		}
	}

	//Afficher l'ennemi
	render(context) {
		this.renderShots(context);
		if (!this.isDead) {
			super.render(context);
			context.beginPath();
			context.fillStyle = this.type;
			//context.fillRect(this.posX, this.posY, this.width, this.width);
			context.drawImage(
				this.image,
				this.posX,
				this.posY,
				this.width,
				this.height
			);
		}
	}

	//metre à jour l'ennemi
	update() {
		this.posX += this.speedX;
		super.update();
		if (this.posX < 0 - this.width) {
			this.fate();
			//Pour permettre la perte de points en cas d'ennemis qui aurait réussi à passer les joueurs, c'est ici
			//Mais pour cela il faudrait créer les joueurs en static dans joueur plutot qu'en dur dans main.
		}
		if (this.posY < 0) {
			this.speedY = Math.abs(this.speedY);
		} else if (this.posY > Entity.canvasHeight - this.height) {
			this.speedY = -this.speedY;
		}
		if (this.type == 'orange' && this.posX < Entity.canvasWidth * 1.2) {
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
	getHurt() {
		//Retourne true si l'ennemi meurt et false sinon.'
		this.lifes--;
		if (this.lifes <= 0) {
			this.fate();
			return true;
		} else if (this.type == 'darkred') {
			this.image.src = './public/res/images/asteroid' + (getRandomInt(4) + 1) + '.png';
			this.height = (Ennemy.height * (this.lifes / 1.3)) | 0;
			this.width = (Ennemy.width * (this.lifes / 1.3)) | 0;
			this.posX += this.width / 3;
			this.posY += this.height / 3;
		}
		return false;
	}

	// Détermine si l'ennemi meurt (se met en attentte de la prochaine manche)
	// ou respawn (si la manche en cours n'est pas finie et qu'il reste des ennemies à faire apparaître).
	fate() {
		if (
			WavesManager.waveNumberOfEnnemysSpawned <
			WavesManager.waveMaxNumberOfEnnemys
		) {
			this.respawn();
		} else {
			this.die();
		}
	}

	respawn() {
		this.isDead = false;
		this.type = Ennemy.types[getRandomInt(Ennemy.types.length)];
		this.applyType();
		this.posX =
			Entity.canvasWidth   +
			getRandomInt(WavesManager.maxRandomSpawnDistance) +
			WavesManager.spawnDistance;
		if (this.type == 'darkred') {
			this.posY =
				getRandomInt(
					Entity.canvasHeight - Ennemy.height * this.lifes - Ennemy.spawnOffset
				) + Ennemy.spawnOffset;
		} else {
			this.posY =
				getRandomInt(Entity.canvasHeight - Ennemy.height - Ennemy.spawnOffset) +
				Ennemy.spawnOffset;
		}
		WavesManager.waveNumberOfEnnemysSpawned++;
	}

	// Applique les particularités et différences entre chaque types d'ennemis.
	// Les red vont tout droit à une vitesse variable, ce sont les plus rapides.
	// Les purple se déplacent en diagonale, ce qui les rend plus difficile à viser.
	// Les orange se déplacent aussi e ndiagonale mais plus lentement, par contre ils tirent des projectiles mortel pour le joueur.
	// Les darkred vont lentement tout droits, ils sont plus gros que les red mais sont plus résistant.
	applyType() {
		this.height = Ennemy.height;
		this.width = Ennemy.width;
		this.lifes = 1;
		this.image.src = './public/res/images/ennemy.png';
		switch (this.type) {
			case 'red':
				this.speedX = -getRandomIntWithMin(2, 3);
				this.speedY = 0;
				this.value = 5;
				break;
			case 'purple':
				this.speedX = -getRandomIntWithMin(1, 2);
				this.speedY = 5;
				this.value = 7;
				break;
			case 'orange':
				this.height = Ennemy.height * 1.5;
				this.width = Ennemy.width * 1.5;
				this.speedX = -getRandomIntWithMin(1, 2);
				this.speedY = getRandomIntWithMin(-1, 1);
				this.value = 10;
				break;
			case 'darkred':
				this.lifes = 3;
				this.height = (Ennemy.height * (this.lifes / 1.3)) | 0;
				this.width = (Ennemy.width * (this.lifes / 1.3)) | 0;
				this.image.src = './public/res/images/asteroid' + (getRandomInt(4) + 1) + '.png';
				this.speedX = -1;
				this.speedY = 0;
				this.value = 15;
				break;
		}
	}

	shoot() {
		this.soundShot.play();
		this.shots.push(
			new Shot(
				this.posX,
				this.posY + this.height / 3,
				false,
				-Ennemy.bulletSpeed
			)
		);
	}

	//Collisions du joueur contre les tirs ennemis
	ennemyShotsCollideWithPlayer(player) {
		if (!player.invincible) {
			for (let s = 0; s < this.shots.length; s++) {
				if (this.shots[s].active) {
					if (this.shots[s].isCollidingWith(player)) {
						this.shots[s].active = false;
						if (player.alive) player.die();
					}
				}
			}
		}
	}
}
