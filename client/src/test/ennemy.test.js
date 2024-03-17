import { Enemy } from '../Enemy.js';
import { WavesManager } from '../wavesManager.js';
import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

describe('Enemy', () => {
	let Enemy;

	beforeEach(() => {
		Enemy = new Enemy();

		it('should respawn with correct properties', () => {
			// Mocking getRandomInt function
			const originalGetRandomInt = Enemy.getRandomInt;
			Enemy.getRandomInt = jest.fn().mockReturnValue(0);

			// Mocking canvas properties
			canvas.width = 100;
			canvas.height = 200;

			// Mocking WavesManager properties
			WavesManager.maxRandomSpawnDistance = 10;
			WavesManager.spawnDistance = 20;

			Enemy.respawn();
			console.log(Enemy);

			assert.strictEqual(Enemy.isDead, false);
			assert.ok(Enemy.type);
			assert.strictEqual(Enemy.posX, 120);
			assert.strictEqual(Enemy.posY, 20);

			// Restoring mocked functions and properties
			Enemy.getRandomInt = originalGetRandomInt;
		});

		it('should respawn with correct posY when type is darkred', () => {
			// Mocking getRandomInt function
			const originalGetRandomInt = Enemy.getRandomInt;
			Enemy.getRandomInt = jest.fn().mockReturnValue(0);

			// Mocking canvas properties
			canvas.height = 200;

			// Mocking Enemy properties
			Enemy.height = 10;
			Enemy.lifes = 2;
			Enemy.spawnOffset = 5;

			Enemy.type = 'darkred';
			Enemy.respawn();

			assert.strictEqual(Enemy.posY, 5);

			// Restoring mocked functions and properties
			Enemy.getRandomInt = originalGetRandomInt;
		});

		it('should respawn with correct posY when type is not darkred', () => {
			// Mocking getRandomInt function
			const originalGetRandomInt = Enemy.getRandomInt;
			Enemy.getRandomInt = jest.fn().mockReturnValue(0);

			// Mocking canvas properties
			canvas.height = 200;

			// Mocking Enemy properties
			Enemy.height = 10;
			Enemy.spawnOffset = 5;

			Enemy.type = 'other';
			Enemy.respawn();

			assert.strictEqual(Enemy.posY, 5);

			// Restoring mocked functions and properties
			Enemy.getRandomInt = originalGetRandomInt;
		});

		it('should increment waveNumberOfEnemysSpawned', () => {
			// Mocking WavesManager properties
			WavesManager.waveNumberOfEnemysSpawned = 0;

			Enemy.respawn();

			assert.strictEqual(WavesManager.waveNumberOfEnemysSpawned, 1);
		});
	});
});
