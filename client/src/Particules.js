import { getRandomInt, coinFlip} from './utils.js';
import Client_Entity from './client_entity.js';
import Entity from '../../server/entity.js';
export class Particules extends Client_Entity {
	static width = 5;
	static height = 5;
	static maxSpeed = 5;
	static bufferParticules = 20;
	static particules = [];
	static entitySpeedMultiplier = 1;
	static nParticules = 5;
	constructor(posX, posY) {
		super(posX, posY, Particules.width, Particules.height);
		this.speedX = 0;
		this.speedY = 0;
		this.active = false;
	}

	static init() {
		for (let i = 0; i < Particules.bufferParticules; i++) {
			Particules.particules[i] = new Particules(this.canvasWidth,this.canvasHeight);
		}
	}

	render(context) {
		if(this.active){
			context.beginPath();
			context.fillStyle = 'grey';
			context.fillRect(this.posX, this.posY, this.width, this.height);
		}
	}

	static renderAll(context) {
		for (let i = 0; i < Particules.particules.length; i++) {
			Particules.particules[i].render(context);
		}
	}

	static updateAll() {
		for (let i = 0; i < Particules.particules.length; i++) {
			Particules.particules[i].update();
		}
	}

	update() {
		if(this.active){
			this.posX += Math.round(this.speedX * (Particules.entitySpeedMultiplier*3)*100)/100;
			this.posY += Math.round(this.speedY * (Particules.entitySpeedMultiplier*3)*100)/100;
			if (this.posX+this.width < 0 || this.posX > Client_Entity.canvasWidth || this.posY+this.height < 0 || this.posY >  Client_Entity.canvas) {
				this.active=false;
			}
		}
	}

	respawn() {
		this.posX =
			Client_Entity.canvasWidth + getRandomInt(Client_Entity.canvasWidth);
		this.posY = getRandomInt(Client_Entity.canvasHeight);
	}

	static explosion(posX, posY){
		let cpt=0;
		for(let i=0; i<Particules.particules.length && cpt<Particules.nParticules; i++){
			if(!Particules.particules[i].active){
				Particules.particules[i].posX=posX;
				Particules.particules[i].posY=posY;
				Particules.particules[i].active=true;
				if(coinFlip()){
					Particules.particules[i].speedX= -getRandomInt(Particules.maxSpeed)-1;
				}else{
					Particules.particules[i].speedX= getRandomInt(Particules.maxSpeed)+1;
				}
				if(coinFlip()){
					Particules.particules[i].speedY= -getRandomInt(Particules.maxSpeed)-1;
				}else{
					Particules.particules[i].speedY= getRandomInt(Particules.maxSpeed)+1;
				}
				cpt++;
			}
		}
	}
}
