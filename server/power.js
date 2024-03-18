import Entity from './entity.js';
import { getRandomInt } from './utils.js';
import Player from './player.js';
import WavesManager from './wavesManager.js';
export default class Power extends Entity {
	static width=40;
    static height=40;
	static speed = 6;
	static types = ['life'];
	constructor( posX, posY, 
		type = Power.types[getRandomInt(Power.types.length)]
	) {
		super(posX, posY, Power.width, Power.height);
		this.speedX = -Power.speed;
		this.speedY = 0;
		this.active = true;
		this.type = type;
	}

	update() {
		super.update();
		if (this.posX < 0 - Power.radius) {
			Power.powers.shift();
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
