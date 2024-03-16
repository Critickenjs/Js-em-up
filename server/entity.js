export default class Entity {

	static canvasWidth=1200;//1200
	static canvasHeight=1200;//600

	constructor(posX, posY, width, height) {
		this.posX = posX;
		this.posY = posY;
		this.speedX = 0;
		this.speedY = 0;
		this.width = width;
		this.height = height;
	}

	update() {
		this.posX+=this.speedX;
		this.posY+=this.speedY;
		this.posX=Math.round(this.posX*100)/100;
		this.posY=Math.round(this.posY*100)/100;
	}

	checkBorderCollision(){
		if(this.posX<0){
			this.posX=0;
			this.speedX=0;
		}else if (this.posX>Entity.canvasWidth-this.width){
			this.posX=Entity.canvasWidth-this.width;
			this.speedX=0;
		}
		if(this.posY<0){
			this.posY=0;
			this.speedY=0;
		}else if (this.posY>Entity.canvasHeight-this.height){
			this.posY=Entity.canvasHeight-this.height;
			this.speedY=0;
		}
	}
}
