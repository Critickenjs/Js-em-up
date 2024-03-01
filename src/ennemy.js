import { Entity } from './entity.js';
import { Shot } from './shot.js';
import { getRandomInt, getRandomIntWithMin } from './utils.js';
export class Ennemy extends Entity {
	static width = 30;
	static height = 30;
	static waveMaxNumberOfEnnemys = 5;
	static waveNumberOfEnnemysSpawned = 0;
	static waveNumber = 1;
	static spawnOffset = 45; // pour éviter que les ennemis spawnent aux bords de l'écran et empietent sur le HUD.
	static waveMultiplier=1.2;
	//static types = ['red','purple','orange','darkred'];
	static types = ['red','darkred'];
	static bulletSpeed = 8;
	static shootTimer=100;
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

	renderShots(context) {
		for (let i = 0; i < this.shots.length; i++) {
			if(this.shots[i].active){
				this.shots[i].render(context);
			}
		}
	}

	updateShots() {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].posX += this.shots[i].speedX;
			this.shots[i].posY += this.shots[i].speedY;
			this.shots[i].update();
			if (this.shots[i].posX < 0) {
				this.shots.shift();
			}
		}
	}

	render(context) {
		context.beginPath();
		context.fillStyle=this.type;
		context.fillRect(this.posX, this.posY,
					this.width, this.width);
	}

	update(canvas) {
		this.posX += this.speedX;
		super.update();
		this.posX += this.speedX;
		this.posY += this.speedY;
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
