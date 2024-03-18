import Entity from './entity.js';
import { getRandomInt } from './utils.js';
import Player from './player.js';
import WavesManager from './wavesManager.js';
export default class Power extends Entity {
	static width=40;
    static height=40;
	static speed = 6;
	static types = ['invincible','life'];
	constructor( posX, posY, type = Power.types[getRandomInt(Power.types.length)]
	) {
		super(posX, posY, Power.width, Power.height);
		this.speedX = -Power.speed;
		this.speedY = 0;
		this.active = true;
		this.type = type;
	}

	update(entitySpeedMultiplier) {
		super.update(entitySpeedMultiplier);
	}

	powerCollideWithPlayer(game,player) {
		if (this.isCollidingWith(player)) {
			this.active = false;
			switch (this.type) {
				case 'invincible':
					player.becomeInvincible(
						Player.maxTimeForInvincibility +
							Player.maxTimeForInvincibility / game.difficulty
					);
					break;
				case 'life':
					game.addToTeamLives(1);
					break;
				case 'ScoreMultiplierBonus':
					/*player.obtainScoreMultiplierBonus(
						Player.maxTimeForScoreMultiplierBonus
					);*/
					break;
				case 'ice':
					/*player.obtainIceMalus(
						Player.maxTimeIceMalus +
							((Player.maxTimeIceMalus / 10) | 0) * WavesManager.difficulty
					);*/
					break;
				case 'perforation':
					/*player.obtainPerforationBonus(
						Player.maxTimePerforationBonus +
						Player.maxTimePerforationBonus / WavesManager.difficulty
					);*/
					break;
			}
		}
	}
}
