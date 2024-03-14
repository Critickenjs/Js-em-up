import { Shot } from '../shot.js';
import { Entity } from '../entity.js';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('Shot', () => {
	it('should initialize with correct properties', () => {
		const shot = new Shot(10, 20, true);

		assert(shot.posX === 10);
		assert(shot.posY === 20);
		assert(shot.speedX === 12);
		assert(shot.speedY === 0);
		assert(shot.width === 20);
		assert(shot.height === 5);
		assert(shot.active === true);
		assert(shot.perforation === false);
		assert(shot.isFromPlayer === true);
	});

	it('should render correctly when active', () => {
		const shot = new Shot(10, 20, true);
		const context = {
			beginPath: () => {},
			lineWidth: 2,
			fillStyle: '',
			stroke: () => {},
			fillRect: (x, y, width, height) => {
				assert(x === 10);
				assert(y === 20);
				assert(width === 20);
				assert(height === 5);
			},
		};

		shot.render(context);

		assert(context.fillStyle === 'green');
	});

	it('should render correctly when active and perforation bonus is true', () => {
		const shot = new Shot(10, 20, true, 12, true);
		const context = {
			beginPath: () => {},
			lineWidth: 2,
			fillStyle: '',
			stroke: () => {},
			fillRect: (x, y, width, height) => {
				assert(x === 10);
				assert(y === 20);
				assert(width === 20);
				assert(height === 5);
			},
		};

		shot.render(context);

		assert(context.fillStyle === 'yellow');
	});

	it('should render correctly when active and isFromPlayer is false', () => {
		const shot = new Shot(10, 20, false);
		const context = {
			beginPath: () => {},
			lineWidth: 2,
			fillStyle: '',
			stroke: () => {},
			fillRect: (x, y, width, height) => {
				assert(x === 10);
				assert(y === 20);
				assert(width === 20);
				assert(height === 5);
			},
		};

		shot.render(context);

		assert(context.fillStyle === 'red');
	});

	it('should update correctly', () => {
		const shot = new Shot(10, 20, true);

		shot.update();
		assert(shot.posX === 19.6);
		assert(shot.posY === 20);
	});
});
