import { Entity } from './entity.js';
import canvas from './main.js';
import { getRandomInt } from './utils.js';
export class Particules extends Entity {
	static width = 5;
	static height = 5;
	static defaultSpeed = 8;
	static bufferParticules=30
	static particules=[];
	constructor(posX, posY) {
		super(posX, posY, Particules.width, Particules.height);
		this.speedX = -Particules.defaultSpeed;
		this.speedY = 0;
	}

	static init(){
		for (let i = 0; i <Particules.bufferParticules; i++) {
			Particules.particules[i] = new Particules(
				getRandomInt(canvas.width), getRandomInt(window.innerHeight)
			);
		}
	}

	render() {
		const context = canvas.getContext('2d');
		//super.render(context); //Pas nécessaire.
		context.beginPath();
		context.fillStyle='yellow';
		context.fillRect(this.posX, this.posY, this.width, this.height);
	}

	static renderAll(){
		for (let i = 0; i < Particules.particules.length; i++) {
			Particules.particules[i].render();
		}
	}

	static updateAll(){
		for (let i = 0; i < Particules.particules.length; i++) {
			Particules.particules[i].update();
		}
	}

	update() {
		//super.update(); //Pas nécessaire.
		this.posX+=this.speedX*Entity.speedMultiplier;
		this.posY+=this.speedY*Entity.speedMultiplier;
		if(this.posX<0){
			this.respawn();
		}
	}

	respawn(){
		this.posX=canvas.width+getRandomInt(canvas.width);
		this.posY=getRandomInt(canvas.height);
	}
}
