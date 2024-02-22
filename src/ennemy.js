import { Entity } from './entity.js';
import { getRandomInt } from './utils.js';
export class Ennemy extends Entity {
	static width = 30;
	static height = 30;
	constructor(posX, posY) {
		super(posX, posY, Ennemy.width, Ennemy.height);
		this.speedX = -3;
		this.speedY = 0;
		this.index = -1;
	}
	render(context) {
		context.beginPath();
		context.strokeStyle = 'red';
		context.rect(this.posX, this.posY, this.width, this.width);
		context.stroke();
	}

	update(canvas) {
		super.update();
		this.posX += this.speedX;
		this.posY += this.speedY;
		if (this.posX < 0 - this.width) {
			this.respawn(canvas);
		}
	}

	respawn(canvas) {
		this.posX = canvas.width;
		this.posY = getRandomInt(canvas.height - 30);
	}
}
