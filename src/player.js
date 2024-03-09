import { Entity } from './entity.js';
import { Shot } from './shot.js';
import canvas from './main.js';

export class Player extends Entity {
	//Les variables de gameplay
	static width = 50;
	static height = 50;
	static defaultNumberOfLife = 3;
	static playerSpeed = 3;
	static bulletSpeed = Shot.defaultSpeed;
	static maxTimeBeforeShooting = 10;
	static maxTimeForInvincibilty = 100;
	static accelerationMultiplier = 1.2;
	static inertiaMultiplier = 1.5; //Lié à l'accéleration : si inertia==accelration alors c'est comme si on désactivait l'accélération et qu'on revenait au déplacement d'avant
	static maxAcceleration = 8;

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
		this.invincibleAnimation = (20 / this.animationSpeed) | 0;
		this.animationSpeed = 0.6; //Vitesse 0,25x 0,5x 0,75x 1x 2x 3x etc (du plus lent au plus rapide) Max 10 car après c'est tellemnt rapide c'est imperceptible.
		this.image = new Image();
		this.image.src = '../images/monster.png';	this.accelerationX = 0;
		this.accelerationX = 0;
		this.accelerationY = 0;
	}


	//Tue le joueur, initialise le timer avant sa réapparition
	die() {
		this.alive = false;
		this.maxTimeBeforeRespawn = (this.maxTimeBeforeRespawn * 1.2) | 0; //Le respawn devient de plus en plus long plus on meurt.
		this.timerBeforeRespawn = this.maxTimeBeforeRespawn;
	}

	//Fais réapparaitre le jouer à ses coordonnées de départ et le rend invincible quelques instants
	respawn() {
		Player.teamLifes--;
		document.querySelector('#lifesValue').innerHTML = Player.teamLifes;
		this.alive = true;
		this.becomeInvincible(Player.maxTimeForInvincibilty);
		this.posY = canvas.height / 2;
		this.posX = 100;
		this.speedX = 0;
		this.speedY = 0;
		this.accelerationX = 0;
		this.accelerationY = 0;
		this.timerBeforeShots = 0;
	}

	becomeInvincible(duration) {
		//default 100 for respawn and 500 for power up
		this.invincible = true;
		this.timerBeforeLosingInvincibility = duration;
		this.animationSpeed = 0.6;
	}

	//Affiche les tirs causés par le joueur.
	renderShots(context) {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].render(context);
		}
	}

	//met à jour les tirs causés par le joueur.
	updateShots() {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].update();
			if (this.shots[i].posX > canvas.width) {
				this.shots.shift();
			}
		}
	}

	//Affiche le joueur.
	render() {
		const context = canvas.getContext('2d');
		this.renderShots(context);
		if (this.alive) {
			if (this.invincible) {
				this.invincibleAnimation--;
				if(this.invincibleAnimation<(10/this.animationSpeed) | 0){
					context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
					if(this.invincibleAnimation<0){
						this.invincibleAnimation=(20/this.animationSpeed) | 0;
					}
				}
				context.lineWidth = 3;
				context.strokeStyle = 'purple';
				context.rect(this.posX, this.posY, this.width, this.height);
				context.stroke();
			}else{
				context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
			}
			context.lineWidth = 1;
			context.font = '16px Minecraft Regular';
			context.imageSmoothingEnabled = false;
			context.fillStyle = 'black';
			context.fillText(this.pseudo, this.posX, this.posY - 10);
		}
	}

	//met à jour le joueur.
	update(keysPressed) {
		super.update(); //Essentiel pour les collisions entre entités
		this.updateShots();
		
		if (this.alive) {
			
			//On vérifie le timer de l'invincibilité du joueur et on la retire si nécessaire.
			if (this.invincible) {
				this.timerBeforeLosingInvincibility--;
				if (this.timerBeforeLosingInvincibility < 0) {
					this.invincible = false;
				}
				//Moins il reste de temps d'invincibilité, plus l'animation s'accélère
				this.animationSpeed =
					Math.floor(
						(this.animationSpeed +
							(0.005 - this.timerBeforeLosingInvincibility / 100000)) *
							100000
					) / 100000;
			}
			
			//On vérifie le timer avant que le joueur ne puisse tirer à nouveau
			this.timerBeforeShots--;
			if (this.timerBeforeShots < 0) {
				this.timerBeforeShots = 0;
			}
			
			//On met à jour la position du joueur
			this.speedY = 0;
			this.speedX = 0;
			this.deceleration();
			this.acceleration(keysPressed);
			
			//Le joueur déclenche un tir et active le cooldown si il appuie sur espace
			if (keysPressed.Space) {
				this.shootWithRecharge();
			}
			if(keysPressed.MouseDown){
				this.shootWithRecharge();
			}
			
			//Collisions avec les bords du canvas
			this.borderCollision();
		} else {
			//Si le joueur n'est pas vivant,
			//on vérifie le timer avant sa réapparition
			//et on le fais réapparaître si nécessaire.
			this.timerBeforeRespawn--;
			if (this.timerBeforeRespawn <= 0) {
				this.respawn();
			}
		}
	}

	borderCollision() {
		if (this.posX > canvas.width - this.width) {
			this.posX = canvas.width - this.width;
			this.accelerationX = 0;
			this.speedX = 0;
		} else if (this.posX < 0) {
			this.posX = 0;
			this.accelerationX = 0;
			this.speedX = 0;
		}
		if (this.posY > canvas.height - this.width) {
			this.posY = canvas.height - this.width;
			this.speedY = 0;
			this.accelerationY = 0;
		} else if (this.posY < 0) {
			this.posY = 0;
			this.speedY = 0;
			this.accelerationY = 0;
		}
	}

	
	shootWithRecharge(){
		if (this.timerBeforeShots <= 0) {
			this.shoot();
			this.timerBeforeShots = 10;
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
	addScorePointOnEnemyKill(ennemy) {
		this.score += ennemy.value;
	}

	//Réinitialise le joueur pour le préparer à une nouvelle partie.
	restart() {
		Player.teamLifes = Player.defaultNumberOfLife;
		this.score = 0;
		document.querySelector('#scoreValue').innerHTML = this.score;
		this.shots = [];
		this.maxTimeBeforeRespawn = 50;
		this.respawn();
	}

	//Collisions des tirs du joueurs avec les ennemis
	playerShotsCollideWithEnnemy(ennemy) {
		for (let s = 0; s < this.shots.length; s++) {
			if (this.shots[s].active) {
				if (this.shots[s].isCollidingWith(ennemy)) {
					this.shots[s].active = false;
					if (ennemy.getHurt()) {
						this.addScorePointOnEnemyKill(ennemy);
						document.querySelector('#scoreValue').innerHTML = this.score;
					}
				}
			}
		}
	}

	///// Accélère en fonction des directions.
	//Distance sert uniquement lors du controle à la souris,
	//en cas de controle clavier il faut laisser la valeur par défaut
	//et donc ne pas mettre de 2ème argument.

	accelerateLeft(acceleration, distance=0.1) {
		acceleration =
			Math.round((acceleration - distance * Player.accelerationMultiplier) * 1000) /
			1000;
		return acceleration;
	}

	accelerateUp(acceleration, distance=0.1) {
		return this.accelerateLeft(acceleration,distance);
	}

	accelerateRight(acceleration, distance=0.1) {
		acceleration =
			Math.round((acceleration + distance * Player.accelerationMultiplier) * 1000) /
			1000;
		return acceleration;
	}

	accelerateDown(acceleration, distance=0.1) {
		return this.accelerateRight(acceleration,distance);
	}

	/////

	acceleration(keysPressed) {
		if(keysPressed.MouseMode){
			this.mouseMovement();
		}else{
			this.keyBoardMovement(keysPressed);
		}
		this.checkMaxAcceleration();
		this.speedX += this.accelerationX;
		this.speedY += this.accelerationY;
	}

	checkMaxAcceleration(){
		if(this.accelerationX>Player.maxAcceleration){
			this.accelerationX=Player.maxAcceleration
		}if(this.accelerationX<-Player.maxAcceleration){
			this.accelerationX=-Player.maxAcceleration
		}
		if(this.accelerationY>Player.maxAcceleration){
			this.accelerationY=Player.maxAcceleration
		}else if(this.accelerationY<-Player.maxAcceleration){
			this.accelerationY=-Player.maxAcceleration
		}
	}

	deceleration() {
		this.accelerationX = this.decelerate(this.accelerationX);
		this.accelerationY = this.decelerate(this.accelerationY);
	}

	decelerate(acceleration) {
		if (acceleration < 0) {
			acceleration = Math.round((acceleration + 1/(10 * Player.inertiaMultiplier)) * 1000) / 1000;
		} else if (acceleration > 0) {
			acceleration = Math.round((acceleration - 1/(10 * Player.inertiaMultiplier)) * 1000) / 1000;
		}
		return acceleration;
	}

	keyBoardMovement(keysPressed){
		if (keysPressed.ArrowDown) {
			this.speedY = Player.playerSpeed;
			this.accelerationY = this.accelerateDown(this.accelerationY);
		}
		if (keysPressed.ArrowUp) {
			this.speedY = -Player.playerSpeed;
			this.accelerationY = this.accelerateUp(this.accelerationY);
		}
		if (keysPressed.ArrowLeft) {
			this.speedX = -Player.playerSpeed;
			this.accelerationX = this.accelerateLeft(this.accelerationX);
		}
		if (keysPressed.ArrowRight) {
			this.speedX = Player.playerSpeed;
			this.accelerationX = this.accelerateRight(this.accelerationX);
		}
	}

	mouseMovement(){
		const vaguely=10;
		const distanceX = Math.round(Math.abs(window.mouseX-this.posX))/2000;
		const distanceY = Math.round(Math.abs(window.mouseY-this.posY))/2000;
		
		if(!(this.posX+this.width/2>window.mouseX-vaguely && this.posX+this.width/2<window.mouseX+vaguely)){
			if(this.posX+this.width/2>window.mouseX){
				this.speedX = -Player.playerSpeed;
				this.accelerationX = this.accelerateLeft(this.accelerationX,distanceX);
			}else{
				this.speedX = Player.playerSpeed;
				this.accelerationX = this.accelerateRight(this.accelerationX,distanceX);
			}
		}
		if(!(this.posY+this.height/2<window.mouseY+vaguely && this.posY+this.height/2>window.mouseY-vaguely)){
			if(this.posY+this.height/2>window.mouseY){
				this.speedY = -Player.playerSpeed;
				this.accelerationY = this.accelerateUp(this.accelerationY,distanceY);
			}else{
				this.speedY = Player.playerSpeed;
				this.accelerationY = this.accelerateDown(this.accelerationY,distanceY);
			}
		}
	}

}
