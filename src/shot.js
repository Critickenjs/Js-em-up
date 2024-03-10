import { Entity } from './entity.js';
export class Shot extends Entity {
	static width = 20;
	static height = 5;
	static defaultSpeed = 12;
	constructor(posX, posY, isFromPlayer, speed=Shot.defaultSpeed) {
		super(posX, posY, Shot.width, Shot.height);
		this.speedX = speed;
		this.speedY = 0;
		this.active = true;
		this.isFromPlayer = isFromPlayer;
	}

	render(context) {
		if (this.active) {
			super.render(context);
			context.beginPath();
			context.lineWidth = 2;
			if (this.isFromPlayer) {
				context.fillStyle = 'green';
			} else {
				context.fillStyle = 'red';
			}
			context.fillRect(this.posX, this.posY, this.width, this.height);
			context.stroke();
		}
	}

	update() {
		super.update();
	}
}
