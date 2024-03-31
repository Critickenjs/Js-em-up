import Entity from './entity.js';
import Shot from './shot.js';
import { getRandomInt } from './utils.js';

export default class Player extends Entity {
	//Declarations
	static width = 50;
	static height = 50;

	//Movement
	static accelerationMultiplier = 1.8;
	static inertiaMultiplier = 1.2; //Lié à l'accéleration : si inertia==accelration alors c'est comme si on désactivait l'accélération et qu'on revenait au déplacement d'avant
	static maxAcceleration = 8;
	static defaultSpeed = 3;

	//Mouse
	static vaguely = 3;

	//Lifes
	static defaultNumberOfLife = 4;

	//Bullets
	static bulletSpeed = Shot.defaultSpeed;

	//Timers
	static maxTimeBeforeShooting = 10;
	static maxTimeForInvincibility = 300;
	static maxTimeBeforeRespawn = 100;

	//Powers
	static maxTimeForScoreMultiplierBonus = 456;
	static maxTimeIceMalus = 300;
	static maxTimePerforationBonus = 324;
	static maxTimeLaserBonus = 180;

	constructor(posX, posY) {
		super(posX, posY, Player.width, Player.height);
		this.width = Player.width;
		this.height = Player.height;
		this.pseudo = 'player';
		this.score = 0;
		//Movement
		this.posX = posX;
		this.posY = posY;
		this.speedX = 0;
		this.speedY = 0;
		this.accelerationX = 0;
		this.accelerationY = 0;

		//Declarations
		this.alive = true;
		this.invincible = true;

		//Bullets
		this.shots = [];

		//Timer
		this.timerBeforeShots = 0;
		this.maxTimeBeforeRespawn = 100;
		this.timerBeforeRespawn = this.maxTimeBeforeRespawn;
		this.timerBeforeLosingInvincibility = Player.maxTimeForInvincibility;

		//Bonus
		this.timerBeforeLosingIceMalus = 0;
		this.iceMultiplierMalus = 1;

		this.timerBeforeLosingScoreMultiplierBonus = 0;
		this.scoreMultiplierBonus = 1;

		this.timerBeforeLosingPerforationBonus = 0;
		this.timerBeforeLosingLaserBonus = 0;
	}

	update(keysPressed, entitySpeedMultiplier) {
		this.updateShots(entitySpeedMultiplier);
		this.speedX = 0;
		this.speedY = 0;
		if (this.alive) {
			//Movements
			this.deceleration();
			this.acceleration(keysPressed);
			super.update(entitySpeedMultiplier);

			if (this.gotScoreMultiplierBonus()) {
				this.timerBeforeLosingScoreMultiplierBonus--;
				if (this.timerBeforeLosingScoreMultiplierBonus <= 0) {
					this.loseScoreMuliplierBonus();
				}
			}

			if (this.gotIceMalus()) {
				this.timerBeforeLosingIceMalus--;
				if (this.timerBeforeLosingIceMalus <= 0) {
					this.loseIceMalus();
				}
			}

			if (this.gotPerforationBonus()) {
				this.timerBeforeLosingPerforationBonus--;
			}

			if (this.gotLaserBonus()) {
				this.timerBeforeLosingLaserBonus--;
				if (this.timerBeforeLosingLaserBonus <= 0) {
					this.shots = [];
				}
			}

			//On vérifie le timer avant que le joueur ne puisse tirer à nouveau

			if (this.timerBeforeShots > 0) {
				this.timerBeforeShots--;
			}
			//Shooting?
			if (this.gotLaserBonus()) {
				this.shootLaser();
			} else {
				if (keysPressed.Space || keysPressed.MouseDown) {
					this.shootWithRecharge(this.gotPerforationBonus());
				}
			}

			if (this.invincible) {
				if (this.timerBeforeLosingInvincibility < 0) {
					this.invincible = false;
				} else {
					this.timerBeforeLosingInvincibility--;
				}
			}
		}
		//Player utilise sa propre fonction borderCollision et pas celle de Entity à cause de ses accélérations
		this.checkBorderCollision();
	}

	updateShots(entitySpeedMultiplier) {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].update(entitySpeedMultiplier);
			if (this.shots[i].posX > Entity.canvasWidth) {
				this.shots.shift();
			}
		}
	}

	shootWithRecharge(perforationBonus = false) {
		if (this.timerBeforeShots <= 0) {
			this.timerBeforeShots = Player.maxTimeBeforeShooting;
			this.shoot(perforationBonus);
		}
	}

	//Fais tirer au joueur un projectile.
	shoot(perforationBonus = false) {
		this.shots.push(
			new Shot(
				this.posX + this.width,
				this.posY + this.height / 2 - Shot.height / 2,
				true,
				Player.bulletSpeed,
				perforationBonus
			)
		);
	}

	shootLaser() {
		if (this.shots.length != 0 && this.shots[this.shots.length - 1].laser) {
			this.shots[this.shots.length - 1].posX = this.posX + this.width;
			this.shots[this.shots.length - 1].posY =
				this.posY + this.height / 2 - Shot.height / 2;
			this.shots[this.shots.length - 1].width = Entity.canvasWidth - this.posX;
		} else {
			this.shots.push(
				new Shot(
					this.posX + this.width,
					this.posY + this.height / 2 - Shot.height / 2,
					true,
					0,
					true,
					true
				)
			);
		}
	}

	//Tue le joueur, augmente le timer avant sa réapparition
	die(game) {
		this.alive = false;
		game.gameData.teamLifes--;
		if (game.gameData.teamLifes < 0) game.gameData.teamLifes = 0;
		if (this.gotLaserBonus()) {
			this.shots = [];
		}
	}

	respawn(difficulty) {
		this.alive = true;
		this.becomeInvincible(
			(Player.maxTimeForInvincibility + 300 / difficulty) | 0
		);
		this.posY = Entity.canvasHeight / 2;
		this.posX = 100;
		this.speedX = 0;
		this.speedY = 0;
		this.accelerationX = 0;
		this.accelerationY = 0;
		this.timerBeforeShots = 0;
		//La réapparition devient de plus en plus long quand on meurt.
		this.maxTimeBeforeRespawn += 5 * difficulty;
		this.timerBeforeRespawn = this.maxTimeBeforeRespawn;

		this.timerBeforeLosingIceMalus = 0;
		this.timerBeforeLosingLaserBonus = 0;
		this.timerBeforeLosingPerforationBonus = 0;
		this.timerBeforeLosingScoreMultiplierBonus = 0;
	}

	becomeInvincible(duration) {
		this.invincible = true;
		this.timerBeforeLosingInvincibility = duration;
	}

	checkBorderCollision() {
		if (this.posX < 0) {
			this.posX = 0;
			this.speedX = 0;
			this.accelerationX = 0;
		} else if (this.posX > Entity.canvasWidth - this.width) {
			this.posX = Entity.canvasWidth - this.width;
			this.speedX = 0;
			this.accelerationX = 0;
		}
		if (this.posY < 0) {
			this.posY = 0;
			this.speedY = 0;
			this.accelerationY = 0;
		} else if (this.posY > Entity.canvasHeight - this.height) {
			this.posY = Entity.canvasHeight - this.height;
			this.speedY = 0;
			this.accelerationY = 0;
		}
	}

	//Collisions des tirs du joueurs avec les ennemis
	playerShotsCollideWithEnemy(waveManager, enemy) {
		for (let s = 0; s < this.shots.length; s++) {
			if (this.shots[s].active) {
				if (this.shots[s].isCollidingWith(enemy)) {
					if (!(this.shots[s].laser && enemy.type == 'boss')) {
						this.shots[s].active = this.shots[s].perforation; //Si non perforation, le tir se désactive, si perforation, le tir continue sa trajectoire;
						if (enemy.getHurt(waveManager)) {
							this.addScorePointOnEnemyKill(enemy);
						}
					}
				}
			}
		}
	}

	addScorePointOnEnemyKill(enemy) {
		this.score += (enemy.value + enemy.difficulty) * this.scoreMultiplierBonus;
	}

	accelerateLeft(acceleration, distance = 0.1) {
		acceleration =
			acceleration -
			Math.round(distance * Player.accelerationMultiplier * 1000) / 1000;
		return acceleration;
	}

	accelerateUp(acceleration, distance = 0.1) {
		return this.accelerateLeft(acceleration, distance);
	}

	accelerateRight(acceleration, distance = 0.1) {
		acceleration =
			Math.round(
				(acceleration + distance * Player.accelerationMultiplier) * 1000
			) / 1000;
		return acceleration;
	}

	accelerateDown(acceleration, distance = 0.1) {
		return this.accelerateRight(acceleration, distance);
	}

	acceleration(keysPressed) {
		if (keysPressed.onPhone) {
			this.gyroscopeMovement(keysPressed);
			this.checkMaxAcceleration(2);
		} else if (keysPressed.MouseMode) {
			this.mouseMovement(keysPressed);
			this.checkMaxAcceleration(1);
		} else {
			this.keyBoardMovement(keysPressed);
			this.checkMaxAcceleration(1);
		}
		this.speedX += this.accelerationX;
		this.speedY += this.accelerationY;
	}

	checkMaxAcceleration(multiplier = 1) {
		if (this.accelerationX > Player.maxAcceleration * multiplier) {
			this.accelerationX = Player.maxAcceleration * multiplier;
		}
		else if (this.accelerationX < -Player.maxAcceleration * multiplier) {
			this.accelerationX = -Player.maxAcceleration * multiplier;
		}
		if (this.accelerationY > Player.maxAcceleration * multiplier) {
			this.accelerationY = Player.maxAcceleration * multiplier;
		}
		else if (this.accelerationY < -Player.maxAcceleration * multiplier) {
			this.accelerationY = -Player.maxAcceleration * multiplier;
		}
	}
	deceleration() {
		this.accelerationX = this.decelerate(this.accelerationX);
		this.accelerationY = this.decelerate(this.accelerationY);
	}

	decelerate(acceleration) {
		if (acceleration < 0) {
			acceleration =
				Math.round(
					(acceleration +
						1 / (10 * Player.inertiaMultiplier * this.iceMultiplierMalus)) *
					1000
				) / 1000;
			if (acceleration > -0.05) acceleration = 0;
		} else if (acceleration > 0) {
			acceleration =
				Math.round(
					(acceleration -
						1 / (10 * Player.inertiaMultiplier * this.iceMultiplierMalus)) *
					1000
				) / 1000;
			if (acceleration < 0.05) acceleration = 0;
		}
		return acceleration;
	}

	keyBoardMovement(keysPressed) {
		if (keysPressed.ArrowDown) {
			this.speedY = Player.defaultSpeed;
			this.accelerationY = this.accelerateDown(this.accelerationY);
		}
		if (keysPressed.ArrowUp) {
			this.speedY = -Player.defaultSpeed;
			this.accelerationY = this.accelerateUp(this.accelerationY);
		}
		if (keysPressed.ArrowLeft) {
			this.speedX = -Player.defaultSpeed;
			this.accelerationX = this.accelerateLeft(this.accelerationX);
		}
		if (keysPressed.ArrowRight) {
			this.speedX = Player.defaultSpeed;
			this.accelerationX = this.accelerateRight(this.accelerationX);
		}
	}


	mouseMovement(keysPressed) {
		const distanceX = Math.round(Math.abs(keysPressed.MouseX - this.posX)) / 2000;
		const distanceY = Math.round(Math.abs(keysPressed.MouseY - this.posY)) / 2000;
		if (
			!(
				this.posX + this.width / 2 > keysPressed.MouseX - Player.vaguely &&
				this.posX + this.width / 2 < keysPressed.MouseX + Player.vaguely
			)
		) {
			if (this.posX + this.width / 2 > keysPressed.MouseX - Player.vaguely) {
				this.speedX = -Player.defaultSpeed;
				this.accelerationX = this.accelerateLeft(this.accelerationX, distanceX);
			} else {
				this.speedX = Player.defaultSpeed;
				this.accelerationX = this.accelerateRight(
					this.accelerationX,
					distanceX
				);
			}
		}
		if (
			!(
				this.posY + this.height / 2 < keysPressed.MouseY + Player.vaguely &&
				this.posY + this.height / 2 > keysPressed.MouseY - Player.vaguely
			)
		) {
			if (this.posY + this.height / 2 > keysPressed.MouseY - Player.vaguely) {
				this.speedY = -Player.defaultSpeed;
				this.accelerationY = this.accelerateUp(this.accelerationY, distanceY);
			} else {
				this.speedY = Player.defaultSpeed;
				this.accelerationY = this.accelerateDown(this.accelerationY, distanceY);
			}
		}
	}

	gyroscopeMovement(keysPressed) {
		this.mouseMovement(keysPressed);
		/*if (keysPressed.beta != null && keysPressed.gamma != null) {
			this.accelerationY = keysPressed.beta;
			this.accelerationX = keysPressed.gamma + 15;//Pour que le controle soit plus fluide
		}*/
		/*if (keysPressed.MouseY < 400) {
			keysPressed.MouseY = 0;
		} else if (keysPressed.MouseY > 500) {
			keysPressed.MouseY = Entity.canvasHeight;
		}

		if (keysPressed.MouseX > 250) {
			keysPressed.MouseX = Entity.canvasWidth;
		}

		if (this.posX < keysPressed.MouseX) {
			this.speedX = Player.defaultSpeed;
			this.accelerationX = this.accelerateRight(this.accelerationX);
		} else {
			this.speedX = -Player.defaultSpeed;
			this.accelerationX = this.accelerateLeft(this.accelerationX);
		}
		if (this.posY < keysPressed.MouseY) {
			this.speedY = Player.defaultSpeed;
			this.accelerationY = this.accelerateDown(this.accelerationY);
		} else {
			this.speedY = -Player.defaultSpeed;
			this.accelerationY = this.accelerateUp(this.accelerationY);
		}*/
	}


	//Duration en tick (60 ticks par seconde)
	obtainScoreMultiplierBonus(duration, multiplier = 2) {
		this.timerBeforeLosingScoreMultiplierBonus = duration | 0;
		this.scoreMultiplierBonus = multiplier;
	}

	loseScoreMuliplierBonus() {
		this.scoreMultiplierBonus = 1;
	}

	gotScoreMultiplierBonus() {
		return this.scoreMultiplierBonus != 1;
	}

	//Duration en tick (60 ticks par seconde)
	obtainIceMalus(duration, multiplier = 5) {
		this.iceMultiplierMalus = multiplier;
		this.timerBeforeLosingIceMalus = duration | 0;
	}

	loseIceMalus() {
		this.iceMultiplierMalus = 1;
	}

	gotIceMalus() {
		return this.iceMultiplierMalus != 1;
	}

	//Duration en tick (60 ticks par seconde)
	obtainPerforationBonus(duration) {
		this.timerBeforeLosingPerforationBonus = duration | 0;
	}

	gotPerforationBonus() {
		return this.timerBeforeLosingPerforationBonus > 0;
	}

	//Duration en tick (60 ticks par seconde)
	obtainLaserBonus(duration) {
		this.timerBeforeLosingLaserBonus = duration | 0;
	}

	gotLaserBonus() {
		return this.timerBeforeLosingLaserBonus > 0;
	}
}
