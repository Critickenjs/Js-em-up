import Entity from './entity.js';
export default class Shot extends Entity {
	static width = 20;
	static height = 5;
	static defaultSpeed = 12;
	constructor(posX, posY, isFromPlayer, speed=Shot.defaultSpeed, perforationBonus=false) {
		super(posX, posY, Shot.width, Shot.height);
		this.speedX = speed;
		this.speedY = 0;
		this.active = true;
		this.perforation = perforationBonus;
		this.isFromPlayer = isFromPlayer;
	}

	update() {
		super.update();
	}
}