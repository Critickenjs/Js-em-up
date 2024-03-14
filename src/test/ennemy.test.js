import { Ennemy } from '../ennemy.js';
import { WavesManager } from '../wavesManager.js';
import canvas from '../main.js';

describe('Ennemy', () => {
	let ennemy;

	beforeEach(() => {
		ennemy = new Ennemy();
	});

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

		expect(ennemy.isDead).toBe(false);
		expect(ennemy.type).toBeDefined();
		expect(ennemy.posX).toBe(120);
		expect(ennemy.posY).toBe(20);

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

		expect(ennemy.posY).toBe(5);

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

		expect(ennemy.posY).toBe(5);

		// Restoring mocked functions and properties
		Ennemy.getRandomInt = originalGetRandomInt;
	});

	it('should increment waveNumberOfEnnemysSpawned', () => {
		// Mocking WavesManager properties
		WavesManager.waveNumberOfEnnemysSpawned = 0;

		ennemy.respawn();

		expect(WavesManager.waveNumberOfEnnemysSpawned).toBe(1);
	});
});
