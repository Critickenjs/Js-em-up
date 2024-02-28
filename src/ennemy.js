import { Entity } from './entity.js';
import { getRandomInt } from './utils.js';
export class Ennemy extends Entity {
	static width = 30;
	static height = 30;
	static waveMaxNumberOfEnnemys = 5;
	static waveNumberOfEnnemysSpawned = 0;
	static waveNumber = 1;
	static spawnOffset = 45; // pour éviter que les ennemis spawnent aux bords de l'écran et empietent sur le HUD.
	static waveMultiplier=1.2;
	constructor(posX, posY) {
		super(posX, posY, Ennemy.width, Ennemy.height);
		this.speedX = -3;
		this.speedY = 0;
		this.index = -1;
		this.isDead = false;
	}
	render(context) {
		context.beginPath();
		context.strokeStyle = 'red';
		context.rect(this.posX, this.posY, this.width, this.width);
		context.stroke();
	}

	update(canvas) {
		this.posX += this.speedX;
		super.update();
		this.posX += this.speedX;
		this.posY += this.speedY;
		if (this.posX < 0 - this.width) {
			this.fate(canvas);
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
		this.posX = canvas.width + getRandomInt(canvas.width);
		this.posY = getRandomInt(canvas.height - Ennemy.height - Ennemy.spawnOffset)+Ennemy.spawnOffset;
		Ennemy.waveNumberOfEnnemysSpawned++;
	}
}
