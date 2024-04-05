import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Shot from '../shot.js';

describe('Shot', () => {
    it('should initialize properties correctly', () => {
        const posX = 10;
        const posY = 20;
        const isFromPlayer = true;
        const speed = 12;
        const perforationBonus = false;
        const laserBonus = false;

        const shot = new Shot(posX, posY, isFromPlayer, speed, 0, perforationBonus, laserBonus);

        assert.strictEqual(shot.posX, posX);
        assert.strictEqual(shot.posY, posY);
        assert.strictEqual(shot.speedX, speed);
        assert.strictEqual(shot.speedY, 0);
        assert.strictEqual(shot.width, Shot.width);
        assert.strictEqual(shot.height, Shot.height);
        assert.strictEqual(shot.active, true);
        assert.strictEqual(shot.perforation, perforationBonus);
        assert.strictEqual(shot.laser, laserBonus);
        assert.strictEqual(shot.isFromPlayer, isFromPlayer);
        assert.strictEqual(shot.tickActive, 0);
    });

    it('should update properties correctly', () => {
        const posX = 10;
        const posY = 20;
        const isFromPlayer = true;
        const speed = 12;
        const perforationBonus = false;
        const laserBonus = false;
        const entitySpeedMultiplier = 1;

        const shot = new Shot(posX, posY, isFromPlayer, speed, 0, perforationBonus, laserBonus);
        shot.update(entitySpeedMultiplier);

        assert.strictEqual(shot.posX, posX + speed * entitySpeedMultiplier);
        assert.strictEqual(shot.posY, posY);
        assert.strictEqual(shot.speedX, speed);
        assert.strictEqual(shot.speedY, 0);
        assert.strictEqual(shot.width, Shot.width);
        assert.strictEqual(shot.height, Shot.height);
        assert.strictEqual(shot.active, true);
        assert.strictEqual(shot.perforation, perforationBonus);
        assert.strictEqual(shot.laser, laserBonus);
        assert.strictEqual(shot.isFromPlayer, isFromPlayer);
        assert.strictEqual(shot.tickActive, 1);
    });


    it('should return true if the laser is activated', () => {
        const posX = 10;
        const posY = 20;
        const isFromPlayer = true;
        const speed = 12;
        const perforationBonus = false;
        const laserBonus = true;

        const shot = new Shot(posX, posY, isFromPlayer, speed, 0, perforationBonus, laserBonus);

        assert.strictEqual(shot.laser, true);
        assert.strictEqual(shot.width, Shot.canvasWidth);
        assert.strictEqual(shot.height, Shot.height + 15);


    });

});