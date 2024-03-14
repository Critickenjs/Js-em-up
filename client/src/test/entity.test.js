import { Entity } from '../entity.js';
import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';

describe('Entity', () => {
	let entity;

	beforeEach(() => {
		entity = new Entity(10, 20, 30, 40);
	});

	it('should initialize with correct properties', () => {
		assert(entity.posX === 10);
		assert(entity.posY === 20);
		assert(entity.speedX === 0);
		assert(entity.speedY === 0);
		assert(entity.width === 30);
		assert(entity.height === 40);
		assert.deepStrictEqual(entity.collision, {
			topLeft: [10, 20],
			topRight: [40, 20],
			bottomLeft: [10, 60],
			bottomRight: [40, 60],
		});
	});

	it('should update position correctly', () => {
		entity.speedX = 2;
		entity.speedY = 3;
		Entity.speedMultiplier = 0.8;

		entity.update();

		assert(entity.posX === 11.6);
		assert(entity.posY === 22.4);
		assert.deepStrictEqual(entity.collision, {
			topLeft: [11.6, 22.4],
			topRight: [41.6, 22.4],
			bottomLeft: [11.6, 62.4],
			bottomRight: [41.6, 62.4],
		});
	});

	it('should detect collision correctly', () => {
		const otherEntity = new Entity(20, 30, 40, 50);

		const isColliding = entity.isCollidingWith(otherEntity);

		assert(isColliding === true);
	});

	it('should detect containment correctly', () => {
		const coordinate = [15, 25];

		const isContained = entity.isThisEntityContainThis(coordinate);

		assert(isContained === true);
	});

	it('should add to speed correctly', () => {
		Entity.speedMultiplier = 0.8;

		Entity.addToSpeed(0.5);

		assert(Entity.speedMultiplier === 1.3);
	});

	it('should set speed correctly', () => {
		Entity.setSpeed(1.5);

		assert(Entity.speedMultiplier === 1.5);
	});
});
