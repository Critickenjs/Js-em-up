export default class Entity {

	static canvasWidth=500;
	static canvasHeight=500;

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
		this.posX=Math.round(this.posX*100)/100;
		this.posY=Math.round(this.posY*100)/100;
	}
}
