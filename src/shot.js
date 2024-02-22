import { Entity } from './entity.js';
export class Shot extends Entity {
	static width = 20;
	static height = 10;
	constructor(posX, posY) {
		super(posX, posY, Shot.width, Shot.height);
		this.speedX = 8;
		this.speedY = 0;
	}
	render(context) {
		context.beginPath();
		context.strokeStyle = 'green';
		context.rect(this.posX, this.posY, this.width, this.height);
		context.stroke();
	}

	update() {
		super.update();
	}
}
