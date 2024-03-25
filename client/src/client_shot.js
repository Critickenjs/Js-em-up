import Client_Entity from './client_entity.js';
export default class Client_Shot extends Client_Entity {
	
	static width = 20;
	static height = 5;

	static effect_thickness = 3;
	static effect_opacity = 0.2;

	static shots=[];

	constructor(posX, posY, isFromAPlayer, perforation, laser=false) {
		super(posX,posY,Client_Shot.width,Client_Shot.height);
		this.isFromAPlayer=isFromAPlayer;
		this.perforation=perforation;
		this.laser=laser;
		if(this.laser){
			this.width=Client_Entity.canvasWidth;
		}
	}

	render(context) {
		super.render(context);
		context.beginPath();
		if(this.isFromAPlayer){
			if(this.perforation || this.laser){
				context.fillStyle = 'yellow';
			}else{
				context.fillStyle = 'green';
			}
		}else{
			context.fillStyle = 'red';
		}
		context.fillRect(this.posX, this.posY, this.width, this.height);
		context.globalAlpha = Client_Shot.effect_opacity; // Réglez l'opacité pour un effet semi-transparent
		context.fillRect(this.posX-Client_Shot.effect_thickness, this.posY-Client_Shot.effect_thickness, this.width+Client_Shot.effect_thickness*2, this.height+Client_Shot.effect_thickness*2); // Dessinez l'effet autour du deuxième rectangle
		context.globalAlpha=1;
	}
}
