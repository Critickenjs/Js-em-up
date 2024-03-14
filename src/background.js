import { Entity } from './entity.js';
import canvas from './main.js';

export class BackGround extends Entity {
    static width=1500;
    static height=1000;
    static transition=3;
	//Les variables de gameplay
    
	constructor(posX, posY) {
		super(posX, posY, BackGround.width,BackGround.height);
        this.image=new Image();
		this.image.src = './images/spaceBackground.jpg';
        this.speedX=-1;
        this.speedY=0;
	}

    update(){
		this.posX+=this.speedX*Entity.speedMultiplier;
		this.posY+=this.speedY*Entity.speedMultiplier;
        if(this.posX<0-BackGround.width){
            this.posX=BackGround.width-(BackGround.transition*Entity.speedMultiplier | 0);
        }
    }

    render(){
        const context = canvas.getContext('2d');
        context.drawImage(
            this.image,
            this.posX,
            this.posY,
            this.width,
            this.height
        );
    }
}