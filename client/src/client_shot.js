import Client_Entity from './client_entity.js';
export default class Client_Shot extends Client_Entity {
	
	static width = 20;
	static height = 5;

	constructor(posX, posY, isFromAPlayer, perforation) {
		super(posX,posY,Client_Shot.width,Client_Shot.height);
		this.isFromAPlayer=isFromAPlayer;
		this.perforation=perforation;
	}

	render(context) {
		context.beginPath();
		context.lineWidth = 3;
		context.strokeStyle = 'red';
		context.rect(this.posX, this.posY, this.width, this.height);
		context.stroke();
	}
	static updateCanvasSize(canvasWidth, canvasHeight) {
		Client_Entity.canvasWidth = canvasWidth;
		Client_Entity.canvasHeight = canvasHeight;
	}
}
