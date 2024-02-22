import { Entity } from './entity.js';
export class Shot extends Entity {
	static width = 20;
	static shots = [];
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

	static renderAll(context) {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].render(context);
		}
	}

	update() {
		super.update();
	}

	static update(canvas) {
		for (let i = 0; i < Shot.shots.length; i++) {
			Shot.shots[i].posX += Shot.shots[i].speedX;
			Shot.shots[i].posY += Shot.shots[i].speedY;
			Shot.shots[i].update();
			if (Shot.shots[i].posX > canvas.width) {
				Shot.shots.shift();
			}
		}
	}
}
