import Client_Entity from './client_entity.js';
export default class Client_Enemy extends Client_Entity {
	static width=40;
	static height=40;

	static enemys=[];
	
	constructor(posX, posY, type, lifes) {
		super(posX, posY, Client_Enemy.width, Client_Enemy.height);
		this.type=type;
		this.lifes=lifes;
		this.image = new Image();
		this.image.src = './public/res/images/enemy.png';
	}

	render(context) {
		super.render(context);
		context.beginPath();
		context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
	}
}
