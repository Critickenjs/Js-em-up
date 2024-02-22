import { Entity } from './entity.js';
import { Shot } from './shot.js';

export class Player extends Entity {
	static width = 50;
	static height = 50;
	constructor(posX, posY) {
		super(posX, posY, Player.width, Player.height);
		this.timerBeforeShots = 0;
	}

	render(context) {
		context.beginPath();
		context.strokeStyle = 'blue';
		context.rect(this.posX, this.posY, this.width, this.width);
		context.stroke();
	}

	shoot() {
		Shot.shots.push(
			new Shot(this.posX + this.width, this.posY + this.height / 3)
		);
	}

	update(canvas, keysPressed) {
		this.timerBeforeShots--;
		if (this.timerBeforeShots < 0) {
			this.timerBeforeShots = 0;
		}
		this.speedY = 0;
		this.speedX = 0;
		if (keysPressed.ArrowDown) {
			this.speedY = 5;
		}
		if (keysPressed.ArrowUp) {
			this.speedY = -5;
		}
		if (keysPressed.ArrowLeft) {
			this.speedX = -5;
		}
		if (keysPressed.ArrowRight) {
			this.speedX = 5;
		}
		if (keysPressed.Space) {
			if (this.timerBeforeShots <= 0) {
				this.shoot();
				this.timerBeforeShots = 10;
			}
		}
		this.posX += this.speedX;
		if (this.posX > canvas.width - this.width) {
			this.posX = canvas.width - this.width;
		} else if (this.posX < 0) {
			this.posX = 0;
		}
		this.posY += this.speedY;
		if (this.posY > canvas.height - this.width) {
			this.posY = canvas.height - this.width;
		} else if (this.posY < 0) {
			this.posY = 0;
		}
	}
}
