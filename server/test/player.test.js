import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Player from '../player.js';

describe('Player', () => {
    describe('update', () => {
        it('should update player properties correctly', () => {
            const player = new Player(0, 0);
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
            assert.strictEqual(player.timerBeforeShots, 9);
            assert.strictEqual(player.invincible, true);
        });

        it('should update player position based on input keys', () => {
            const player = new Player(0, 0);
            const keysPressed = {
                ArrowUp: true,
                ArrowLeft: true,
            };
            const entitySpeedMultiplier = 1;

            player.update(keysPressed, entitySpeedMultiplier);

            assert.strictEqual(player.posX, 0);
            assert.strictEqual(player.posY, 0);
        });

        it('should handle border collision correctly', () => {
            const canvasWidth = 800;
            const canvasHeight = 600;
            const player = new Player(canvasWidth - 50, canvasHeight - 50);
            const keysPressed = {
                ArrowRight: true,
                ArrowDown: true,
            };
            const entitySpeedMultiplier = 1;

            player.update(keysPressed, entitySpeedMultiplier);

            assert.strictEqual(player.posX, 753.18);
            assert.strictEqual(player.posY, canvasHeight - player.height);
        });
    });

    it('should correctly handle invincibility duration', () => {
        const player = new Player(0, 0);
        const keysPressed = {};
        const entitySpeedMultiplier = 1;

        player.becomeInvincible(60);
        player.update(keysPressed, entitySpeedMultiplier);

        assert.strictEqual(player.invincible, true);


        for (let i = 0; i < 30; i++) {
            player.update(keysPressed, entitySpeedMultiplier);
        }

        assert.strictEqual(player.invincible, true);


        for (let i = 0; i < 31; i++) {
            player.update(keysPressed, entitySpeedMultiplier);
        }

        assert.strictEqual(player.invincible, false);
    });
    describe('playerShotsCollideWithEnemy', () => {
        it('should handle collision between player shots and enemy', () => {
            const player = new Player(0, 0);
            const enemy = { isCollidingWith: () => true, getHurt: () => true };
            const shot = { active: true, perforation: false };
            player.shots = [shot];
            assert.strictEqual(shot.active, true);
        });
    });

    describe('addScorePointOnEnemyKill', () => {
        it('should add score points and increment kills on enemy kill', () => {
            const player = new Player(0, 0);
            const enemy = { value: 10, difficulty: 5 };
            player.addScorePointOnEnemyKill(enemy);
            assert.strictEqual(player.score, (enemy.value + enemy.difficulty) * player.scoreMultiplierBonus);
            assert.strictEqual(player.kills, 1);
        });
    });




    describe('loseScoreMuliplierBonus', () => {
        it('should reset score multiplier bonus to 1', () => {
            const player = new Player(0, 0);
            player.scoreMultiplierBonus = 2;
            player.loseScoreMuliplierBonus();
            assert.strictEqual(player.scoreMultiplierBonus, 1);
        });
    });
});
