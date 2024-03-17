import { getRandomInt } from './utils.js';
import Client_Entity from './client_entity.js';
export class Particules extends Client_Entity {
	static width = 5;
	static height = 5;
	static defaultSpeed = 1;
	static bufferParticules = 30;
	static particules = [];
	static entitySpeedMultiplier = 1;
	constructor(posX, posY) {
		super(posX, posY, Particules.width, Particules.height);
		this.speedX = -Particules.defaultSpeed;
		this.speedY = 0;
	}

	static init() {
		for (let i = 0; i < Particules.bufferParticules; i++) {
			Particules.particules[i] = new Particules(
				getRandomInt(Client_Entity.canvasWidth),
				getRandomInt(Client_Entity.canvasHeight)
			);
		}
	}

	render(context) {
		super.render(context); //Pas nécessaire.
		context.beginPath();
		context.fillStyle = 'yellow';
		context.fillRect(this.posX, this.posY, this.width, this.height);
	}

	static renderAll(context) {
		for (let i = 0; i < Particules.particules.length; i++) {
			Particules.particules[i].render(context);
		}
	}

	static updateAll() {
		for (let i = 0; i < Particules.particules.length; i++) {
			Particules.particules[i].update();
		}
	}

	update() {
		this.posX += Math.round(this.speedX * (Particules.entitySpeedMultiplier*3)*100)/100;
		this.posY += Math.round(this.speedY * (Particules.entitySpeedMultiplier*3)*100)/100;
		if (this.posX < 0) {
			this.respawn();
		}
	}

	respawn() {
		this.posX =
			Client_Entity.canvasWidth + getRandomInt(Client_Entity.canvasWidth);
		this.posY = getRandomInt(Client_Entity.canvasHeight);
	}
}
