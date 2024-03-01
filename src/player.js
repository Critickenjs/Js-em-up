import { Entity } from './entity.js';
import { Shot } from './shot.js';

export class Player extends Entity {
	//Les variables de gameplay
	static width = 50;
	static height = 50;
	static defaultNumberOfLife = 3;
	static playerSpeed = 5;
	static bulletSpeed = 8;
	static maxTimeBeforeShooting = 10;
	static maxTimeForInvincibilty = 100;

	//Paramétrage technique
	static animationSpeed=1; //Vitesse 0,25x 0,5x 0,75x 1x 2x 3x etc (du plus lent au plus rapide) Max 10 car après c'est tellemnt rapide c'est imperceptible.

	//Les déclarations
	static teamLifes = Player.defaultNumberOfLife; //vies de départ : default 3
	static players = [];

	constructor(posX, posY) {
		super(posX, posY, Player.width, Player.height);
		this.timerBeforeShots = 0;
		this.alive = true;
		this.invincible = true;
		this.score = 0;
		this.shots = [];
		this.pseudo = 'player';
		this.maxTimeBeforeRespawn = 50;
		this.timerBeforeRespawn = this.maxTimeBeforeRespawn;
		this.timerBeforeLosingInvincibility = Player.maxTimeForInvincibilty;
		this.invincibleAnimation = (20/Player.animationSpeed) | 0;
	}

	//Tue le joueur, initialise le timer avant sa réapparition
	die() {
		this.alive = false;
		this.maxTimeBeforeRespawn = (this.maxTimeBeforeRespawn * 1.2) | 0; //Le respawn devient de plus en plus long plus on meurt.
		this.timerBeforeRespawn = this.maxTimeBeforeRespawn;
	}

	//Fais réapparaitre le jouer à ses coordonnées de départ et le rend invincible quelques instants
	respawn(canvas) {
		Player.teamLifes--;
		this.alive = true;
		this.invincible = true;
		this.timerBeforeLosingInvincibility = Player.maxTimeForInvincibilty;
		this.posY = canvas.height / 2;
		this.posX = 100;
		this.speedX = 0;
		this.speedY = 0;
		this.timerBeforeShots = 0;
	}

	//Affiche le joueur.
	render(context) {
		this.renderShots(context);
		if (this.alive) {
			context.beginPath();
			
			if (this.invincible) {
				this.invincibleAnimation--;
				if(this.invincibleAnimation<(10/Player.animationSpeed) | 0){
					context.fillStyle = 'blue';
					context.fillRect(this.posX, this.posY, this.width, this.height);
					if(this.invincibleAnimation<0){
						this.invincibleAnimation=(20/Player.animationSpeed) | 0;
					}
				}			
				context.lineWidth = 3;
				context.strokeStyle = 'purple';
				context.rect(
					this.posX,
					this.posY,
					this.width,
					this.height
				);
				context.stroke();
			}else{
				context.fillStyle = 'blue';
				context.fillRect(this.posX, this.posY, this.width, this.height);
			}
			context.lineWidth = 1;
			context.font = '16px Minecraft Regular';
			context.imageSmoothingEnabled = false;
			context.fillStyle = 'black';
			context.fillText(this.pseudo, this.posX, this.posY - 10);
		}
	}

	//Affiche les tirs causés par le joueur.
	renderShots(context) {
		for (let i = 0; i < this.shots.length; i++) {
			if (this.shots[i].active) {
				this.shots[i].render(context);
			}
		}
	}

	//met à jour les tirs causés par le joueur.
	updateShots(canvas) {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].update();
			if (this.shots[i].posX > canvas.width) {
				this.shots.shift();
			}
		}
	}

	//met à jour le joueur.
	update(canvas, keysPressed) {
		super.update(); //Essentiel pour les collisions entre entités
		this.updateShots(canvas);
		if (this.alive) {
			//On vérifie le timer de l'invincibilité du joueur et on la retire si nécessaire.
			if (this.invincible) {
				this.timerBeforeLosingInvincibility--;
				if (this.timerBeforeLosingInvincibility < 0) {
					this.invincible = false;
				}
			}
			//On vérifie le timer avant que le joueur ne puisse tirer à nouveau
			this.timerBeforeShots--;
			if (this.timerBeforeShots < 0) {
				this.timerBeforeShots = 0;
			}
			//On met à jour la position du joueur
			this.speedY = 0;
			this.speedX = 0;
			if (keysPressed.ArrowDown) {
				this.speedY = 5;
			}
			if (keysPressed.ArrowUp) {
				this.speedY = -5;
			}
			if (keysPressed.ArrowLeft) {
				this.speedX = -5;
			}
			if (keysPressed.ArrowRight) {
				this.speedX = 5;
			}
			//Le joueur déclenche un tir et active le cooldown si il appuie sur espace
			if (keysPressed.Space) {
				if (this.timerBeforeShots <= 0) {
					this.shoot();
					this.timerBeforeShots = 10;
				}
			}
			//Collisions avec les bords du canvas
			if (this.posX > canvas.width - this.width) {
				this.posX = canvas.width - this.width;
			} else if (this.posX < 0) {
				this.posX = 0;
			}
			if (this.posY > canvas.height - this.width) {
				this.posY = canvas.height - this.width;
			} else if (this.posY < 0) {
				this.posY = 0;
			}
		} else {
			//Si le joueur n'est pas vivant,
			//on vérifie le timer avant sa réapparition
			//et on le fais réapparaître si nécessaire.
			this.timerBeforeRespawn--;
			if (this.timerBeforeRespawn <= 0) {
				this.respawn(canvas);
			}
		}
	}

	//Fais tirer au joueur un projectile.
	shoot() {
		this.shots.push(
			new Shot(
				this.posX + this.width,
				this.posY + this.height / 3,
				Player.bulletSpeed,
				true
			)
		);
	}

	//Ajoute des points au joueur pour chaque kill d'ennemis
	addScorePointOnEnemyKill() {
		this.score += 10;
	}

	//Réinitialise le joueur pour le préparer à une nouvelle partie.
	restart(canvas) {
		Player.teamLifes = Player.defaultNumberOfLife;
		this.score = 0;
		this.shots = [];
		this.maxTimeBeforeRespawn = 50;
		this.respawn(canvas);
	}
}
