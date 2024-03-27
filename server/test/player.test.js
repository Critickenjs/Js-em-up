import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Player from '../player.js';

describe('Player', () => {
    describe('update', () => {
        it('should update player properties correctly', () => {
            const player = new Player();
            const keysPressed = {
                Space: true,
                MouseDown: false,
            };
            const entitySpeedMultiplier = 2;

            player.update(keysPressed, entitySpeedMultiplier);

            assert.strictEqual(player.speedX, 0);
            assert.strictEqual(player.speedY, 0);
            assert.strictEqual(player.timerBeforeLosingScoreMultiplierBonus, 0);
            assert.strictEqual(player.timerBeforeLosingIceMalus, 0);
            assert.strictEqual(player.timerBeforeLosingPerforationBonus, 0);
            assert.strictEqual(player.timerBeforeLosingLaserBonus, 0);
            assert.strictEqual(player.timerBeforeShots, 10);
            assert.strictEqual(player.invincible, true);
        });






    });

});