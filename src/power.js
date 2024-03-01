import { Entity } from './entity.js';
import canvas from './main.js';
export class Power extends Entity {
	static radius = 50;
    static speed = 10;
    static types = ['invincibility','life'];
	constructor(posX, posY) {
		super(posX, posY, Power.radius, Power.radius);
		this.speedX = -Power.speed;
		this.speedY = 0;
		this.active = true;
        this.type;
	}
	
	render() {
		const context = canvas.getContext('2d');
		context.beginPath();
        context.lineWidth = 3;
        context.strokeStyle = 'purple';
        context.arc(this.posX+Power.radius/2, this.posY+Power.radius/2, Power.radius/2, 0, 2 * Math.PI);
        context.stroke();
	}

	update() {
		super.update();
        if(this.posX<0){
            this.posX=canvas.width;
        }
	}
}
