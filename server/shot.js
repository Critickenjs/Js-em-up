import Entity from './entity.js';
export default class Shot extends Entity {
	static width = 20;
	static height = 5;
	static defaultSpeed = 12;
	constructor(posX, posY, isFromPlayer, speed=Shot.defaultSpeed, perforationBonus=false, laserBonus=false) {
		super(posX, posY, Shot.width, Shot.height);
		this.speedX = speed;
		this.speedY = 0;
		this.active = true;
		this.perforation = perforationBonus;
		this.laser = laserBonus;
		this.isFromPlayer = isFromPlayer;
		if(this.laser){
			this.width=Entity.canvasWidth;
			this.height=Shot.height+15;
		}
	}

	update(entitySpeedMultiplier) {
		super.update(entitySpeedMultiplier);
	}
}