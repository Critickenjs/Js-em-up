import Client_Entity from './client_entity.js';
export default class Client_Player extends Client_Entity {
	static width=50;
	static height=50;
	
	constructor(posX, posY, pseudo) {
		super(posX, posY, Client_Player.width, Client_Player.height);
		this.pseudo=pseudo;
		this.image = new Image();
		this.image.src = './public/res/images/spaceship.png';
	}

	render(context) {
		super.render(context);
		context.beginPath();
		context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
	}
}
