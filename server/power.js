import Entity from './entity.js';
import { getRandomInt, getRandomIntWithMinPositive } from './utils.js';
import Player from './player.js';

export default class Power extends Entity {
	static width = 40;
	static height = 40;
	static frequencyPowerSpawn = 20;
	static speed = 6;
	static types = [
		'trishot', 'invincible', 'life', 'ice', 'perforation', 'laser', 'scoreMultiplierBonus',
	];
	constructor(
		posX,
		posY,
		type = Power.types[getRandomInt(Power.types.length)]
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

	powerActivation(game, player) {
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
			case 'scoreMultiplierBonus':
				player.obtainScoreMultiplierBonus(
					Player.maxTimeForScoreMultiplierBonus,
					getRandomIntWithMinPositive(2, game.difficulty)
				);
				break;
			case 'ice':
				player.obtainIceMalus(
					Player.maxTimeIceMalus +
					((Player.maxTimeIceMalus / 10) | 0) * game.difficulty
				);
				break;
			case 'perforation':
				player.obtainPerforationBonus(
					Player.maxTimePerforationBonus +
					Player.maxTimePerforationBonus / game.difficulty
				);
				break;
			case 'laser':
				player.obtainLaserBonus(
					Player.maxTimeLaserBonus + Player.maxTimeLaserBonus / game.difficulty
				);
				break;
			case 'trishot':
				player.obtainTriShotBonus(
					Player.maxTimeLaserBonus + Player.maxTimeTriShotBonus / game.difficulty
				);
				break;
		}
	}
}
