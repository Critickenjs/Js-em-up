import { Entity } from './entity.js';
export class Shot extends Entity {
	static width = 20;
	static height = 10;
	constructor(posX, posY, speed, isFromPlayer) {
		super(posX, posY, Shot.width, Shot.height);
		this.speedX = speed;
		this.speedY = 0;
		this.active = true;
		this.isFromPlayer = isFromPlayer;
	}
	
	render(context) {
		context.beginPath();
		if(this.isFromPlayer){
			context.strokeStyle = 'green';
		}else{
			context.strokeStyle = 'red';
		}
		context.rect(this.posX, this.posY, this.width, this.height);
		context.stroke();
	}

	update() {
		super.update();
	}
}
