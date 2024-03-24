import { getRandomInt } from './utils.js';
import Client_Entity from './client_entity.js';
export class Stars extends Client_Entity {
	static width = 5;
	static height = 5;
	static defaultSpeed = 1;
	static bufferStars = 30;
	static Stars = [];
	static entitySpeedMultiplier = 1;
	constructor(posX, posY) {
		super(posX, posY, Stars.width, Stars.height);
		this.speedX = -Stars.defaultSpeed;
		this.speedY = 0;
	}

	static init() {
		for (let i = 0; i < Stars.bufferStars; i++) {
			Stars.Stars[i] = new Stars(
				getRandomInt(Client_Entity.canvasWidth),
				getRandomInt(Client_Entity.canvasHeight)
			);
		}
	}

	render(context) {
		context.beginPath();
		context.fillStyle = 'yellow';
		context.fillRect(this.posX, this.posY, this.width, this.height);
	}

	static renderAll(context) {
		for (let i = 0; i < Stars.Stars.length; i++) {
			Stars.Stars[i].render(context);
		}
	}

	static updateAll() {
		for (let i = 0; i < Stars.Stars.length; i++) {
			Stars.Stars[i].update();
		}
	}

	update() {
		this.posX += Math.round(this.speedX * (Stars.entitySpeedMultiplier*3)*100)/100;
		this.posY += Math.round(this.speedY * (Stars.entitySpeedMultiplier*3)*100)/100;
		if (this.posX+this.width < 0) {
			this.respawn();
		}
	}

	respawn() {
		this.posX =
			Client_Entity.canvasWidth + getRandomInt(Client_Entity.canvasWidth);
		this.posY = getRandomInt(Client_Entity.canvasHeight);
	}
}
