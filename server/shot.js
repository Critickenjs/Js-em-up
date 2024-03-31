import Entity from './entity.js';
export default class Shot extends Entity {
	static width = 20;
	static height = 5;
	static defaultSpeed = 12;
	constructor(posX, posY, isFromPlayer, speedX = Shot.defaultSpeed, speedY = 0, perforationBonus = false, laserBonus = false) {
		super(posX, posY, Shot.width, Shot.height);
		this.speedX = speedX;
		this.speedY = speedY;
		this.active = true;
		this.perforation = perforationBonus;
		this.laser = laserBonus;
		this.isFromPlayer = isFromPlayer;
		this.tickActive = 0;
		if (this.laser) {
			this.width = Entity.canvasWidth;
			this.height = Shot.height + 15;
		}
	}

	update(entitySpeedMultiplier) {
		super.update(entitySpeedMultiplier);
		this.tickActive++;
	}
}