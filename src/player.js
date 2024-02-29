import { Entity } from './entity.js';
import { Shot } from './shot.js';

export class Player extends Entity {
	static width = 50;
	static height = 50;
	static maxLifes = 1;
	static playerSpeed = 5;
	static bulletSpeed = 8;
	static maxTimeBeforeShooting = 10;

	constructor(posX, posY) {
		super(posX, posY, Player.width, Player.height);
		this.timerBeforeShots = 0;
		this.alive = true;
		this.score = 0;
		this.shots = [];
		this.pseudo = 'player';
		this.lifes = Player.maxLifes;

		this.timerBeforeRespawn = 100;
	}

	die() {
		this.alive = false;
		this.timerBeforeRespawn = 200 + Player.maxLifes * 10 - this.lifes * 10;
		this.lifes--;
	}

	respawn(canvas) {
		this.alive = true;
		this.posY = canvas.height / 2;
		this.posX = 100;
		this.speedX = 0;
		this.speedY = 0;
		this.timerBeforeShots = 0;
	}

	render(context) {
		this.renderShots(context);
		if (this.alive) {
			context.beginPath();
			context.fillStyle = 'blue';
			context.fillRect(this.posX, this.posY, this.width, this.width);
			context.font = '16px Minecraft Regular';
			context.imageSmoothingEnabled = false;
			context.fillStyle = 'black';
			context.fillText(this.pseudo, this.posX, this.posY - 10);
		}
	}

	renderShots(context) {
		for (let i = 0; i < this.shots.length; i++) {
			if(this.shots[i].active){
				this.shots[i].render(context);
			}
		}
	}

	updateShots(canvas) {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].posX += this.shots[i].speedX;
			this.shots[i].posY += this.shots[i].speedY;
			this.shots[i].update();
			if (this.shots[i].posX > canvas.width) {
				this.shots.shift();
			}
		}
	}

	shoot() {
		this.shots.push(
			new Shot(this.posX + this.width,
				this.posY + this.height / 3 ,
				Player.bulletSpeed, true)
		);
	}

	update(canvas, keysPressed) {
		super.update();
		this.updateShots(canvas);
		if (this.alive) {
			this.timerBeforeShots--;
			if (this.timerBeforeShots < 0) {
				this.timerBeforeShots = 0;
			}
			this.speedY = 0;
			this.speedX = 0;
			if (keysPressed.ArrowDown) {
				this.speedY = Player.playerSpeed;
			}
			if (keysPressed.ArrowUp) {
				this.speedY = -Player.playerSpeed;
			}
			if (keysPressed.ArrowLeft) {
				this.speedX = -Player.playerSpeed;
			}
			if (keysPressed.ArrowRight) {
				this.speedX = Player.playerSpeed;
			}
			if (keysPressed.Space) {
				if (this.timerBeforeShots <= 0) {
					this.shoot();
					this.timerBeforeShots = Player.maxTimeBeforeShooting;
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
		} else {
			this.timerBeforeRespawn--;
			if (this.timerBeforeRespawn <= 0) {
				this.respawn(canvas);
			}
		}
	}

	addScorePointOnEnemyKill() {
		this.score += 10;
	}

	restart(canvas) {
		this.lifes = this.maxLifes;
		this.score = 0;
		this.respawn(canvas);
	}
}
