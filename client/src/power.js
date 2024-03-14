import { Entity } from './entity.js';
import { getRandomInt } from './utils.js';
import { Player } from './player.js';
import { WavesManager } from './wavesManager.js';
export class Power extends Entity {
	static radius = 40;
	static speed = 6;
	static types = ['life']; //'rapidFire'
	static powers = [];
	constructor(
		posX,
		posY,
		type = Power.types[getRandomInt(Power.types.length)]
	) {
		super(posX, posY, Power.radius, Power.radius);
		this.speedX = -Power.speed;
		this.speedY = 0;
		this.active = true;
		this.type = type;
		this.image = new Image();
		switch (this.type) {
			case 'invincible':
				this.image.src = './public/res/images/bonusShield.png';
				break;
			case 'life':
				this.image.src = './public/res/images/bonusLife.png';
				break;
			case 'ScoreMultiplierBonus':
				this.image.src = './public/res/images/bonusArrows.png';
				break;
			case 'ice':
				this.image.src = './public/res/images/ice.png';
				break;
			case 'perforation':
				this.image.src = './public/res/images/bonusArrows.png';
				break;
		}
	}

	render(context) {
		if (this.active) {
			context.beginPath();
			context.lineWidth = 3;
			context.strokeStyle = 'purple';
			context.arc(
				this.posX + Power.radius / 2,
				this.posY + Power.radius / 2,
				Power.radius / 2,
				0,
				2 * Math.PI
			);
			context.stroke();
			context.drawImage(
				this.image,
				this.posX,
				this.posY,
				this.width,
				this.height
			);
		}
	}

	update() {
		super.update();
		if (this.posX < 0 - Power.radius) {
			Power.powers.shift();
		}
	}

	static renderAll(context) {
		for (let i = 0; i < Power.powers.length; i++) {
			Power.powers[i].render(context);
		}
	}

	static updateAll(player) {
		for (let i = 0; i < Power.powers.length; i++) {
			Power.powers[i].powerCollideWithPlayer(player);
			Power.powers[i].update();
		}
	}

	powerCollideWithPlayer(player) {
		if (this.active) {
			if (this.isCollidingWith(player)) {
				this.active = false;
				switch (this.type) {
					case 'invincible':
						player.becomeInvincible(
							Player.maxTimeForInvincibility +
								Player.maxTimeForInvincibility / WavesManager.difficulty
						);
						break;
					case 'life':
						player.addToTeamLives(1);
						break;
					case 'ScoreMultiplierBonus':
						player.obtainScoreMultiplierBonus(
							Player.maxTimeForScoreMultiplierBonus
						);
						break;
					case 'ice':
						player.obtainIceMalus(
							Player.maxTimeIceMalus +
								((Player.maxTimeIceMalus / 10) | 0) * WavesManager.difficulty
						);
						break;
					case 'perforation':
						player.obtainPerforationBonus(
							Player.maxTimePerforationBonus +
								Player.maxTimePerforationBonus / WavesManager.difficulty
						);
						break;
				}
			}
		}
	}
}
