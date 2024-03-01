export class Entity {
	static speedMultiplier=0.8;
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

	update() {
		this.posX+=this.speedX*Entity.speedMultiplier;
		this.posY+=this.speedY*Entity.speedMultiplier;
		this.collision = {
			topLeft: [this.posX, this.posY],
			topRight: [this.posX + this.width, this.posY],
			bottomLeft: [this.posX, this.posY + this.height],
			bottomRight: [this.posX + this.width, this.posY + this.height],
		};
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

	static addToSpeed(modifyer){
		Entity.speedMultiplier=Math.round((Entity.speedMultiplier+modifyer)*1000)/1000
		if(Entity.speedMultiplier>2){
			Entity.speedMultiplier=2;
		}
	}

	static setSpeed(newSpeed){
		Entity.speedMultiplier=Math.round((newSpeed)*1000)/1000
	}
}
