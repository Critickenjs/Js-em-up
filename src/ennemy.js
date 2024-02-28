import { Entity } from './entity.js';
import { getRandomInt, getRandomIntWithMin } from './utils.js';
export class Ennemy extends Entity {
	static width = 30;
	static height = 30;
	static waveMaxNumberOfEnnemys = 5;
	static waveNumberOfEnnemysSpawned = 0;
	static waveNumber = 1;
	static spawnOffset = 45; // pour éviter que les ennemis spawnent aux bords de l'écran et empietent sur le HUD.
	static waveMultiplier=1.2;
	static types = ['red','purple','orange'];
	constructor(posX, posY, type) {
		super(posX, posY, Ennemy.width, Ennemy.height);
		this.index = -1;
		this.isDead = false;
		this.type = type;
		this.applyType();
	}
	render(context) {
		context.beginPath();
		context.fillStyle=this.type;
		context.fillRect(this.posX, this.posY, this.width, this.width);
		
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
	}

	die(){
		this.isDead=true;
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
		this.posY = getRandomInt(canvas.height - Ennemy.height - Ennemy.spawnOffset)+Ennemy.spawnOffset;
		Ennemy.waveNumberOfEnnemysSpawned++;
	}

	applyType(){
		switch(this.type){
			case'red':
				this.speedX = -getRandomIntWithMin(2,3);
				this.speedY = 0;
			break;
			case'purple':
				this.speedX = -1
				this.speedY = 5;
			break;
			case'orange':
				this.speedX = -1;
				this.speedY = getRandomIntWithMin(-1,1);
			break;
		}
	}
}
