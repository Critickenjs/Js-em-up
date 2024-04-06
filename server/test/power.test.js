import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import Power from '../power.js';
import Game from '../game.js';
import Player from '../player.js';

describe('Power', () => {
    describe('types', () => {
        it('should contain the correct types', () => {
            const expectedTypes = [
                'trishot', 'invincible', 'life', 'ice', 'perforation', 'laser', 'scoreMultiplierBonus'
            ];

            assert.deepStrictEqual(Power.types, expectedTypes);
        });
    });

    describe('update', () => {
        it('should update position x of power correctly', () => {
            const power = new Power(100, 100, 'ice');
            const entitySpeedMultiplier = 2;
            let oldPosX = power.posX;
            power.update(entitySpeedMultiplier);
            let newPosX = oldPosX + power.speedX * entitySpeedMultiplier;
            newPosX = Math.round(newPosX * 100) / 100;
            assert.strictEqual(power.posX, newPosX);
        });
        it('should update position y of power correctly', () => {
            const power = new Power(100, 100, 'ice');
            const entitySpeedMultiplier = 2;
            let oldPosY = power.posY;
            power.update(entitySpeedMultiplier);
            let newPosY = oldPosY + power.speedY * entitySpeedMultiplier;
            newPosY = Math.round(newPosY * 100) / 100;
            assert.strictEqual(power.posY, newPosY);
        });
    });

    describe('powerActivation', () => {
        let power;
        let game;
        let player;
        beforeEach(() => {
            power = new Power(101, 101, '');
            game = new Game(1);
            player = new Player(100, 100, 'testeur');
        });
        it('should activate power invincible correctly', () => {
            power.type = 'invincible';
            power.powerActivation(game, player);
            assert.strictEqual(player.invincible, true);
        });

        it('should activate power life correctly', () => {
            power.type = 'life';
            const oldNbLife = game.gameData.teamLifes;
            power.powerActivation(game, player);
            assert.strictEqual(game.gameData.teamLifes, oldNbLife + 1);
        });

        it('should activate power ice correctly', () => {
            power.type = 'ice';
            power.powerActivation(game, player);
            assert.strictEqual(player.gotIceMalus(), true);
        });

        it('should activate power scoreMultiplierBonus correctly', () => {
            power.type = 'scoreMultiplierBonus';
            power.powerActivation(game, player);
            assert.strictEqual(player.gotScoreMultiplierBonus(), true);
        });

        it('should activate power perforation correctly', () => {
            power.type = 'perforation';
            power.powerActivation(game, player);
            assert.strictEqual(player.gotPerforationBonus(), true);
        });

        it('should activate power laser correctly', () => {
            power.type = 'laser';
            power.powerActivation(game, player);
            assert.strictEqual(player.gotLaserBonus(), true);
        });

        it('should activate power trishot correctly', () => {
            power.type = 'trishot';
            power.powerActivation(game, player);
            assert.strictEqual(player.gotTriShotBonus(), true);
        });
    });

    describe('isCollidingWith', () => {
        it('should return true if power is colliding with player', () => {
            const power = new Power(100, 100, '');
            const player = new Player(100, 100, 'testeur');
            assert.strictEqual(power.isCollidingWith(player), true);
        });

        it('should return false if power is not colliding with player', () => {
            const power = new Power(100, 100, '');
            const player = new Player(200, 200, 'testeur');
            assert.strictEqual(power.isCollidingWith(player), false);
        });
    });




});