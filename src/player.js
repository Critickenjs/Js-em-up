import { Entity } from './entity.js';
import { Shot } from './shot.js';

export class Player extends Entity {
	//Les constantes
	static width = 50;
	static height = 50;
	static defaultNumberOfLife = 3;
	static playerSpeed = 5;
	static bulletSpeed = 8;
	static maxTimeBeforeShooting = 10;
	static maxTimeForInvincibilty = 100;

	//Les déclarations
	static teamLifes = Player.defaultNumberOfLife; //vies de départ : default 3
	static players = [];

	constructor(posX, posY) {
		super(posX, posY, Player.width, Player.height);
		this.timerBeforeShots = 0;
		this.alive = true;
		this.invincible = true;
		this.score = 0;
		this.shots = [];
		this.pseudo = 'player';
		this.maxTimeBeforeRespawn = 50;
		this.timerBeforeRespawn = this.maxTimeBeforeRespawn;
		this.timerBeforeLosingInvincibility = Player.maxTimeForInvincibilty;
	}

	die() {
		this.alive = false;
		this.maxTimeBeforeRespawn = (this.maxTimeBeforeRespawn * 1.2) | 0; //Le respawn devient de plus en plus long plus on meurt.
		this.timerBeforeRespawn = this.maxTimeBeforeRespawn;
		Player.teamLifes--;
	}

	respawn(canvas) {
		this.alive = true;
		this.invincible = true;
		this.timerBeforeLosingInvincibility = Player.maxTimeForInvincibilty;
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
			context.fillRect(this.posX, this.posY, this.width, this.height);
			if (this.invincible) {
				context.lineWidth = 5;
				context.strokeStyle = 'purple';
				context.rect(
					this.posX - 1,
					this.posY - 1,
					this.width + 1,
					this.height + 1
				);
				context.stroke();
			}
			context.lineWidth = 1;
			context.font = '16px Minecraft Regular';
			context.imageSmoothingEnabled = false;
			context.fillStyle = 'black';
			context.fillText(this.pseudo, this.posX, this.posY - 10);
		}
	}

	renderShots(context) {
		for (let i = 0; i < this.shots.length; i++) {
			if (this.shots[i].active) {
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
			new Shot(
				this.posX + this.width,
				this.posY + this.height / 3,
				Player.bulletSpeed,
				true
			)
		);
	}

	update(canvas, keysPressed) {
		super.update();
		this.updateShots(canvas);
		if (this.alive) {
			if (this.invincible) {
				this.timerBeforeLosingInvincibility--;
				if (this.timerBeforeLosingInvincibility < 0) {
					this.invincible = false;
				}
			}
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
		Player.teamLifes = Player.defaultNumberOfLife;
		this.score = 0;
		this.maxTimeBeforeRespawn = 50;
		this.respawn(canvas);
	}
}
