import { Entity } from './entity.js';
import { Shot } from './shot.js';
import { getRandomInt, getRandomIntWithMin } from './utils.js';
export class Ennemy extends Entity {

	//Les variables de gameplay
	static width = 30;
	static height = 30;
	static types = ['red','purple','orange','darkred'];
	static bulletSpeed = 8;
	static shootTimer=100;
	
	//Waves
	static waveMaxNumberOfEnnemys = 5;
	static waveNumberOfEnnemysSpawned = 0;
	static waveNumber = 1;
	static waveMultiplier=1.2;

	//Paramétrage technique
	static spawnOffset = 45; // pour éviter que les ennemis spawnent aux bords de l'écran et empietent sur le HUD.
	
	constructor(posX, posY) {
		super(posX, posY, Ennemy.width, Ennemy.height);
		this.index = -1;
		this.isDead = false;
		this.lifes=1;
		this.type = 'red';
		this.applyType();
		this.timeBeforeNextShoot=Ennemy.shootTimer;
		this.shots = [];
	}

	//Afficher les tirs causés par un ennemi.
	renderShots(context) {
		for (let i = 0; i < this.shots.length; i++) {
			if(this.shots[i].active){
				this.shots[i].render(context);
			}
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
		context.beginPath();
		context.fillStyle=this.type;
		context.fillRect(this.posX, this.posY,
					this.width, this.width);
	}

	//metre à jour l'ennemi
	update(canvas) {
		this.posX += this.speedX;
		super.update();
		if (this.posX < 0 - this.width) {
			this.fate(canvas);
		}
		if(this.posY<0){
			this.speedY=Math.abs(this.speedY);
		}else if(this.posY>canvas.height-Ennemy.height){
			this.speedY=-this.speedY;
		}
		if(this.type=='orange' && this.posX<canvas.width*1.2){
			this.timeBeforeNextShoot--;
			if(this.timeBeforeNextShoot<=0){
				this.shoot();
				this.timeBeforeNextShoot=Ennemy.shootTimer;
			}
		}
	}

	die(){
		this.isDead=true;
	}

	// La fonction se lance en cas de contact avec une balle d'un joueur.
	// Donne la possibilité aux ennemis d'avoirs plusieurs points de vie et de ne pas mourir instantanément.
	getHurt(canvas){ //Retourne true si l'ennemi meurt et false sinon.'
		this.lifes--;
		if(this.lifes<=0){
			this.fate(canvas);
			return true;
		}else if(this.type=='darkred'){
			this.height = Ennemy.height*(this.lifes/1.3) | 0;
			this.width = Ennemy.width*(this.lifes/1.3) | 0;
			this.posX+=this.width/3;
			this.posY+=this.height/3;
		}
		return false;
	}

	// Détermine si l'ennemi meurt (se met en attentte de la prochaine manche)
	// ou respawn (si la manche en cours n'est pas finie et qu'il reste des ennemies à faire apparaître).
	fate(canvas){ 
		if(Ennemy.waveNumberOfEnnemysSpawned<Ennemy.waveMaxNumberOfEnnemys){
			this.respawn(canvas);
		}else{
			this.die();
		}
	}

	respawn(canvas) {
		this.isDead=false;
		this.type=Ennemy.types[getRandomInt(Ennemy.types.length)]
		this.applyType();
		this.posX = canvas.width + getRandomInt(canvas.width);
		if(this.type=='darkred'){
			this.posY = getRandomInt(canvas.height - Ennemy.height*this.lifes - Ennemy.spawnOffset)+Ennemy.spawnOffset;
		}else{
			this.posY = getRandomInt(canvas.height - Ennemy.height - Ennemy.spawnOffset)+Ennemy.spawnOffset;
		}
		Ennemy.waveNumberOfEnnemysSpawned++;
	}

	// Applique les particularités et différences entre chaque types d'ennemis.
	// Les red vont tout droit à une vitesse variable, ce sont les plus rapides.
	// Les purple se déplacent en diagonale, ce qui les rend plus difficile à viser.
	// Les orange se déplacent aussi e ndiagonale mais plus lentement, par contre ils tirent des projectiles mortel pour le joueur.
	// Les darkred vont lentement tout droits, ils sont plus gros que les red mais sont plus résistant.
	applyType(){
		this.height = Ennemy.height;
		this.width = Ennemy.width;
		switch(this.type){
			case'red':
				this.lifes=1;
				this.speedX = -getRandomIntWithMin(1,2);
				this.speedY = 0;
			break;
			case'purple':
				this.lifes=1;
				this.speedX = -1
				this.speedY = 5;
			break;
			case'orange':
				this.lifes=1;
				this.speedX = -1;
				this.speedY = getRandomIntWithMin(-1,1);
			break;
			case'darkred':
				this.lifes=3;
				this.height = Ennemy.height*(this.lifes/1.3) | 0;
				this.width = Ennemy.width*(this.lifes/1.3) | 0;
				this.speedX = -1;
				this.speedY = 0;
			break;
		}
	}

	shoot() {
		this.shots.push(
			new Shot(this.posX,
				this.posY + this.height / 3 ,
				-Ennemy.bulletSpeed, false)
		);
	}
}
