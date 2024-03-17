import Entity from "../../server/entity.js";

export default class Client_Entity {
	//Canvas
	static canvasWidth = 800;
	static canvasHeight = 800;
	
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
		if(Client_Entity.showCollisions){
			context.beginPath();
			context.lineWidth = Client_Entity.lineThickness;
			context.strokeStyle = 'red';
			context.rect(this.posX, this.posY, this.width, this.height);
			context.stroke();
		}
	}
	static updateCanvasSize(canvasWidth, canvasHeight) {
		Client_Entity.canvasWidth = canvasWidth;
		Client_Entity.canvasHeight = canvasHeight;
	}
}
