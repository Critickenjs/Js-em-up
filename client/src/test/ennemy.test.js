import { Ennemy } from '../ennemy.js';
import { WavesManager } from '../wavesManager.js';
import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

describe('Ennemy', () => {
	let ennemy;

	beforeEach(() => {
		ennemy = new Ennemy();

		it('should respawn with correct properties', () => {
			// Mocking getRandomInt function
			const originalGetRandomInt = Ennemy.getRandomInt;
			Ennemy.getRandomInt = jest.fn().mockReturnValue(0);

			// Mocking canvas properties
			canvas.width = 100;
			canvas.height = 200;

			// Mocking WavesManager properties
			WavesManager.maxRandomSpawnDistance = 10;
			WavesManager.spawnDistance = 20;

			ennemy.respawn();
			console.log(ennemy);

			assert.strictEqual(ennemy.isDead, false);
			assert.ok(ennemy.type);
			assert.strictEqual(ennemy.posX, 120);
			assert.strictEqual(ennemy.posY, 20);

			// Restoring mocked functions and properties
			Ennemy.getRandomInt = originalGetRandomInt;
		});

		it('should respawn with correct posY when type is darkred', () => {
			// Mocking getRandomInt function
			const originalGetRandomInt = Ennemy.getRandomInt;
			Ennemy.getRandomInt = jest.fn().mockReturnValue(0);

			// Mocking canvas properties
			canvas.height = 200;

			// Mocking Ennemy properties
			Ennemy.height = 10;
			Ennemy.lifes = 2;
			Ennemy.spawnOffset = 5;

			ennemy.type = 'darkred';
			ennemy.respawn();

			assert.strictEqual(ennemy.posY, 5);

			// Restoring mocked functions and properties
			Ennemy.getRandomInt = originalGetRandomInt;
		});

		it('should respawn with correct posY when type is not darkred', () => {
			// Mocking getRandomInt function
			const originalGetRandomInt = Ennemy.getRandomInt;
			Ennemy.getRandomInt = jest.fn().mockReturnValue(0);

			// Mocking canvas properties
			canvas.height = 200;

			// Mocking Ennemy properties
			Ennemy.height = 10;
			Ennemy.spawnOffset = 5;

			ennemy.type = 'other';
			ennemy.respawn();

			assert.strictEqual(ennemy.posY, 5);

			// Restoring mocked functions and properties
			Ennemy.getRandomInt = originalGetRandomInt;
		});

		it('should increment waveNumberOfEnnemysSpawned', () => {
			// Mocking WavesManager properties
			WavesManager.waveNumberOfEnnemysSpawned = 0;

			ennemy.respawn();

			assert.strictEqual(WavesManager.waveNumberOfEnnemysSpawned, 1);
		});
	});
});
