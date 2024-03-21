import Client_Entity from './client_entity.js';
export default class Client_Shot extends Client_Entity {
	
	static width = 20;
	static height = 5;

	static shots=[];

	constructor(posX, posY, isFromAPlayer, perforation, laser=false) {
		super(posX,posY,Client_Shot.width,Client_Shot.height);
		this.isFromAPlayer=isFromAPlayer;
		this.perforation=perforation;
		this.laser=laser;
		if(this.laser){
			this.width=Client_Entity.canvasWidth;
			this.height=Client_Shot.height;
		}
	}

	render(context) {
		super.render(context);
		context.beginPath();
		if(this.isFromAPlayer && !this.laser){
			if(this.perforation){
				context.fillStyle = 'yellow';
			}else{
				context.fillStyle = 'green';
			}
		}else{
			context.fillStyle = 'red';
		}
		context.fillRect(this.posX, this.posY, this.width, this.height);
	}
}
