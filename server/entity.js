export default class Entity {
	constructor(posX, posY, width, height) {
		this.posX = posX;
		this.posY = posY;
		this.speedX = 0;
		this.speedY = 0;
		this.width = width;
		this.height = height;
	}

	update() {
		this.posX+=this.speedX;
		this.posY+=this.speedY;
		this.posX | 0;
		this.poY | 0;
	}
}
