import Client_Entity from './client_entity.js';
export default class Client_Power extends Client_Entity {
	
	static width = 20;
	static height = 5;

	static powers=[];

	constructor(posX, posY, type) {
		super(posX,posY,Client_Power.width,Client_Power.height);
		this.type=type;
	}

	render(context) {
		super.render(context);
		context.beginPath();
        context.fillStyle = 'yellow';
		context.fillRect(this.posX, this.posY, this.width, this.height);
	}
}
