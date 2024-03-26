import Entity from '../../server/entity.js';
import Client_Entity from './client_entity.js';
export default class Client_Enemy extends Client_Entity {
	static width=40;
	static height=40;

	static enemys=new Map();
	
	constructor(posX, posY, type, lifes) {
		super(posX, posY, Client_Enemy.width, Client_Enemy.height);
		this.type=type;
		this.lifes=lifes;
		this.oldNbLifes=lifes;
		this.image = new Image();
	}

	rebuild(){
		switch (this.type) {
			case 'red':
				this.width=Client_Enemy.width;
				this.height=Client_Enemy.height
				this.image.src = './public/res/images/enemy.png';
				break;
			case 'purple':
				this.width=Client_Enemy.width;
				this.height=Client_Enemy.height;
				this.image.src = './public/res/images/enemy.png';
				break;
			case 'orange':
				this.height = Client_Enemy.height * 1.5 | 0;
				this.width = Client_Enemy.width * 1.5 | 0;
				this.image.src = './public/res/images/enemy2.png';
				break;
			case 'darkred':
				this.height = (Client_Enemy.height * (this.lifes / 1.3)) | 0;
				this.width = (Client_Enemy.width * (this.lifes / 1.3)) | 0;
				this.image.src = './public/res/images/asteroid'+this.lifes+'.png';
				break;
		}
	}

	reset(){
		this.posX=Entity.canvasWidth;
		this.posY=Entity.canvasHeight;
		this.type="red";
		this.lifes=0;
	}

	render(context) {
		if(this.lifes>0){
			super.render(context);
			context.beginPath();
			context.drawImage(this.image, this.posX, this.posY, this.width, this.height);
		}
	}
}
