import Entity from './entity.js';

export default class Player extends Entity {
    static width=50;
    static height=50;

    //Movement
	static accelerationMultiplier = 1.5;
	static inertiaMultiplier = 1.2; //Lié à l'accéleration : si inertia==accelration alors c'est comme si on désactivait l'accélération et qu'on revenait au déplacement d'avant
	static maxAcceleration = 8;
    static defaultSpeed=3;
    

	constructor(posX, posY) {
        super(posX,posY,Player.width,Player.height);
		this.posX = posX;
		this.posY = posY;
		this.speedX = 0;
		this.speedY = 0;
		this.width = Player.width;
		this.height = Player.height;
        
		this.accelerationX = 0;
		this.accelerationY = 0;
        this.pomme=0;
	}

	update(keysPressed) {
		this.speedX=0;
		this.speedY=0;
		this.deceleration();
        this.acceleration(keysPressed);
        console.log(this.accelerationX+" & "+this.accelerationY);
		super.update();
	}

    accelerateLeft(acceleration, distance = 0.1) {
		acceleration =
			acceleration - Math.round((distance * Player.accelerationMultiplier)*1000)/1000;
		return acceleration;
	}

	accelerateUp(acceleration, distance = 0.1) {
		return this.accelerateLeft(acceleration, distance);
	}

	accelerateRight(acceleration, distance = 0.1) {
		acceleration = Math.round((acceleration + distance * Player.accelerationMultiplier)*1000)/1000;
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
            if(acceleration>-0.1) acceleration=0;
		} else if (acceleration > 0) {
			acceleration = Math.round((acceleration - 1 / (10 * Player.inertiaMultiplier)) *1000) / 1000;
            if(acceleration<0.1) acceleration=0;
		}
		return acceleration;
    }

	keyBoardMovement(keysPressed) {
		if (keysPressed.ArrowDown) {
			this.speedY = Player.defaultSpeed;
			this.accelerationY = this.accelerateDown(this.accelerationX);
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
}