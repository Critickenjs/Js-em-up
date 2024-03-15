import Client_Entity from './client_entity.js';
export default class Client_Player extends Client_Entity {
	constructor(posX, posY) {
		super(posX, posY);
		this.image = new Image();
		this.image.src = './public/res/images/spaceship.png';
	}

	render(context) {
		context.beginPath();
		context.drawImage(this.image, this.posX, this.posY, 50, 50);
		context.stroke();
	}
}
