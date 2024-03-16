import Entity from './entity.js';

export default class Player extends Entity {
	//Declarations
	static width = 50;
	static height = 50;

	//Movement
	static accelerationMultiplier = 1.5;
	static inertiaMultiplier = 1.2; //Lié à l'accéleration : si inertia==accelration alors c'est comme si on désactivait l'accélération et qu'on revenait au déplacement d'avant
	static maxAcceleration = 8;
	static defaultSpeed = 3;

	//Lifes
	static defaultNumberOfLife = 3;
	static teamLifes=Player.defaultNumberOfLife;
	
	//Bullets
	static bulletSpeed = Shot.defaultSpeed;

	//Players
	static players = new Map();

	constructor(posX, posY) {
		super(posX, posY, Player.width, Player.height);
		this.posX = posX;
		this.posY = posY;
		this.speedX = 0;
		this.speedY = 0;
		this.width = Player.width;
		this.height = Player.height;

		this.accelerationX = 0;
		this.accelerationY = 0;
	}

	update(keysPressed) {
		this.speedX = 0;
		this.speedY = 0;
		this.deceleration();
        this.acceleration(keysPressed);
       	super.update();
		this.checkBorderCollision();
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
		console.log("acceleration : "+this.accelerationX+"&"+this.accelerationY);
		
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
