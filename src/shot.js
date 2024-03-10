import { Entity } from './entity.js';
export class Shot extends Entity {
	static width = 20;
	static height = 10;
	static defaultSpeed = 12;
	static soundPlayer = '../sounds/shot.mp3';
	static soundEnemy = '../sounds/shotEnemy.mp3';
	constructor(posX, posY, speed, isFromPlayer) {
		super(posX, posY, Shot.width, Shot.height);
		this.speedX = speed;
		this.speedY = 0;
		this.active = true;
		this.isFromPlayer = isFromPlayer;
		this.soundPlayer = new Audio(Shot.soundPlayer);
		this.soundEnemy = new Audio(Shot.soundEnemy);
	}

	render(context) {
		if (this.active) {
			context.beginPath();
			context.lineWidth = 2;
			if (this.isFromPlayer) {
				context.strokeStyle = 'green';
				this.soundPlayer.play();
			} else {
				context.strokeStyle = 'red';
				this.soundEnemy.play();
			}
			context.rect(this.posX, this.posY, this.width, this.height);
			context.stroke();
		}
	}

	update() {
		super.update();
	}
}
