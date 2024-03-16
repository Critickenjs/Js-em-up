import Entity from "../../server/entity.js";

export default class Client_Entity {
	//Canvas
	static canvasWidth = 800;
	static canvasHeight = 800;

	//Particules
	static speedMultiplier = 1;
	
	//Showing collisions
	static showCollisions = false;
	static lineThickness=3;

	constructor(posX, posY, width, height) {
		this.posX = posX;
		this.posY = posY;
		this.width=width;
		this.height=height;
	}

	render(context) {
		console.log('POS:' + this.posX + ':' + this.posY);
		context.beginPath();
		context.lineWidth = Entity.lineThickness;
		context.strokeStyle = 'red';
		context.rect(this.posX-Entity.lineThickness, this.posY-Entity.lineThickness, this.width+Entity.lineThickness, this.height+Entity.lineThickness);
		context.stroke();
	}
	static updateCanvasSize(canvasWidth, canvasHeight) {
		Client_Entity.canvasWidth = canvasWidth;
		Client_Entity.canvasHeight = canvasHeight;
	}
}
