import Entity from './entity.js';
import Shot from './shot.js';

export default class Player extends Entity {
	//Declarations
	static width = 50;
	static height = 50;

	//Movement
	static accelerationMultiplier = 1.8;
	static inertiaMultiplier = 1.2; //Lié à l'accéleration : si inertia==accelration alors c'est comme si on désactivait l'accélération et qu'on revenait au déplacement d'avant
	static maxAcceleration = 8;
	static defaultSpeed = 3;

	//Lifes
	static defaultNumberOfLife = 3;
	static teamLifes=Player.defaultNumberOfLife;
	 
	//Bullets
	static bulletSpeed = Shot.defaultSpeed;

	//Timer
	static maxTimeBeforeShooting = 10;
	static maxTimeForInvincibility = 300;
	

	//Players
	static players = new Map();

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

	}

	update(keysPressed) {
		this.updateShots();
		this.speedX = 0;
		this.speedY = 0;
		if (this.alive) {
			//Movements
			this.deceleration();
			this.acceleration(keysPressed);
			super.update();
			
			//On vérifie le timer avant que le joueur ne puisse tirer à nouveau
			this.timerBeforeShots--;
			if (this.timerBeforeShots < 0) {
				this.timerBeforeShots = 0;
			}
			//Shooting?
			if (keysPressed.Space || keysPressed.MouseDown) {
				this.shootWithRecharge();//this.gotPerforationBonus());
			}

		}
		//Player utilise sa propre fonction borderCollision et pas celle de Entity à cause de ses accélérations
		this.checkBorderCollision();
	}

	updateShots() {
		for (let i = 0; i < this.shots.length; i++) {
			this.shots[i].update();
			if (this.shots[i].posX > Entity.canvasWidth) {
				this.shots.shift();
			}
		}
	}

	shootWithRecharge(perforationBonus = false) {
		if (this.timerBeforeShots <= 0) {
			this.shoot(perforationBonus);
			this.timerBeforeShots = Player.maxTimeBeforeShooting;
		}
	}

	//Fais tirer au joueur un projectile.
	shoot(perforationBonus = false) {
		this.shots.push(
			new Shot(
				this.posX + this.width,
				this.posY + (this.height / 2) - (Shot.height/2),
				true,
				Player.bulletSpeed,
				perforationBonus
			)
		);
	}

	//Tue le joueur, augmente le timer avant sa réapparition
	die() {
		this.alive = false;
		//Le respawn devient de plus en plus long quand on meurt. 
		this.maxTimeBeforeRespawn =
			(this.maxTimeBeforeRespawn *
				(Math.round((1 + 0.1) * 100) / 100)) | 0; //TODO 1 + WavesManager.difficulty / 10
		this.timerBeforeRespawn = this.maxTimeBeforeRespawn;
	}

	respawn() {
		Player.teamLifes--;
		this.alive = true;
		this.becomeInvincible(
			(Player.maxTimeForInvincibility) | 0 // / WavesManager.difficulty
		);
		this.posY = Entity.canvasHeight / 2;
		this.posX = 100;
		this.speedX = 0;
		this.speedY = 0;
		this.accelerationX = 0;
		this.accelerationY = 0;
		this.timerBeforeShots = 0;
		this.timerBeforeLosingIceMalus = 0;
		this.iceMultiplierMalus = 1;
		this.timerBeforeLosingScoreMultiplierBonus = 0;
		this.scoreMultiplierBonus = 1;
		this.timerBeforeLosingPerforationBonus = 0;
	}

	becomeInvincible(duration) {
		//default 100 for respawn and 500 for power up
		this.invincible = true;
		this.timerBeforeLosingInvincibility = duration;
	}

	checkBorderCollision(){
		if(this.posX<0){
			this.posX=0;
			this.speedX=0;
			this.accelerationX=0;
		}else if (this.posX>Entity.canvasWidth-this.width){
			this.posX=Entity.canvasWidth-this.width;
			this.speedX=0;
			this.accelerationX=0;
		}
		if(this.posY<0){
			this.posY=0;
			this.speedY=0;
			this.accelerationY=0;
		}else if (this.posY>Entity.canvasHeight-this.height){
			this.posY=Entity.canvasHeight-this.height;
			this.speedY=0;
			this.accelerationY=0;
		}
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
		this.keyBoardMovement(keysPressed);
		this.checkMaxAcceleration();
		this.speedX += this.accelerationX;
		this.speedY += this.accelerationY;
	}

	checkMaxAcceleration() {
		if (this.accelerationX > Player.maxAcceleration) {
			this.accelerationX = Player.maxAcceleration;
		}
		if (this.accelerationX < -Player.maxAcceleration) {
			this.accelerationX = -Player.maxAcceleration;
		}
		if (this.accelerationY > Player.maxAcceleration) {
			this.accelerationY = Player.maxAcceleration;
		} else if (this.accelerationY < -Player.maxAcceleration) {
			this.accelerationY = -Player.maxAcceleration;
		}
	}
	deceleration() {
		this.accelerationX = this.decelerate(this.accelerationX);
		this.accelerationY = this.decelerate(this.accelerationY);
	}

	decelerate(acceleration) {
        if (acceleration < 0) {
			acceleration = Math.round((acceleration + 1 / (10 * Player.inertiaMultiplier)) * 1000) / 1000;
            if(acceleration>-0.05) acceleration=0;
		} else if (acceleration > 0) {
			acceleration = Math.round((acceleration - 1 / (10 * Player.inertiaMultiplier)) *1000) / 1000;
            if(acceleration<0.05) acceleration=0;
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

	static resetTeamLives() {
		Player.teamLifes = Player.defaultNumberOfLife;
	}

	static addToTeamLives(n) {
		Player.teamLifes += n;
	}

	static atLeast1PlayerAlive(){
		const iterator = Player.players.entries();
    
        let entry;
        for(let i=0; i<map.size; i++){
            entry = iterator.next();
            if(entry.value!=null){
                if(entry.value[1].alive){
					return true;
				}
            }
        }
		return false;
	}
}
