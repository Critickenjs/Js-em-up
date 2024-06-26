export default class Entity {
	static canvasWidth = 1200; //1600
	static canvasHeight = 600; //800

	static speedMultiplierDefault = 0.8;
	static speedMultiplierMAX = 2;

	constructor(posX, posY, width, height) {
		this.posX = posX;
		this.posY = posY;
		this.speedX = 0;
		this.speedY = 0;
		this.width = width;
		this.height = height;
		this.collision = {
			topLeft: [posX, posY],
			topRight: [posX + width, posY],
			bottomLeft: [posX, posY + height],
			bottomRight: [posX + width, posY + height],
		};
	}

	update(entitySpeedMultiplier) {
		this.posX += this.speedX * entitySpeedMultiplier;
		this.posY += this.speedY * entitySpeedMultiplier;
		this.posX = Math.round(this.posX * 100) / 100;
		this.posY = Math.round(this.posY * 100) / 100;
		this.collision = {
			topLeft: [this.posX, this.posY],
			topRight: [this.posX + this.width, this.posY],
			bottomLeft: [this.posX, this.posY + this.height],
			bottomRight: [this.posX + this.width, this.posY + this.height],
		};
	}

	checkBorderCollision() {
		if (this.posX < 0) {
			this.posX = 0;
			this.speedX = 0;
		} else if (this.posX > Entity.canvasWidth - this.width) {
			this.posX = Entity.canvasWidth - this.width;
			this.speedX = 0;
		}
		if (this.posY < 0) {
			this.posY = 0;
			this.speedY = 0;
		} else if (this.posY > Entity.canvasHeight - this.height) {
			this.posY = Entity.canvasHeight - this.height;
			this.speedY = 0;
		}
	}

	isCollidingWith(entity) {
		if (this.width * this.height < entity.width * entity.height) {
			return this.isThisEntityInsideThisOther(entity);
		} else {
			return entity.isThisEntityInsideThisOther(this);
		}
	}

	isThisEntityInsideThisOther(entity) {
		for (const collisionProperty in this.collision) {
			if (entity.isThisEntityContainThis(this.collision[collisionProperty])) {
				return true;
			}
		}
		return false;
	}

	isThisEntityContainThis(coordinate) {
		return (
			coordinate[0] > this.collision.topLeft[0] &&
			coordinate[0] < this.collision.bottomRight[0] &&
			coordinate[1] > this.collision.topLeft[1] &&
			coordinate[1] < this.collision.bottomRight[1]
		);
	}
}
