export default class Client_Entity {
	constructor(posX, posY) {
		this.posX = posX;
		this.posY = posY;
	}

	render(context){
		console.log("POS:"+this.posX+":"+this.posY);
		context.beginPath();
		context.lineWidth = 3;
		context.strokeStyle='red';
		context.rect(this.posX, this.posY,50, 50);
		context.stroke();
	}
}
