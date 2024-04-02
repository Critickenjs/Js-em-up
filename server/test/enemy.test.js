import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import Enemy from '../enemy.js';

describe('Enemy', () => {
    describe('applyTypes', () => {
        let enemy;

        beforeEach(() => {
            enemy = new Enemy();
        });

        it('should set properties correctly for type "red"', () => {
            enemy.type = 'red';
            enemy.difficulty = 1;
            enemy.applyType();

            assert.strictEqual(enemy.height, Enemy.height);
            assert.strictEqual(enemy.width, Enemy.width);
            assert.strictEqual(enemy.lifes, 1);
            assert.strictEqual(enemy.shootTimer, 160);
            assert.ok(enemy.speedX <= -2 && enemy.speedX >= -3);
            assert.strictEqual(enemy.speedY, 0);
            assert.strictEqual(enemy.value, 10);
        });

        it('should set properties correctly for type "purple"', () => {
            enemy.type = 'purple';
            enemy.difficulty = 1;
            enemy.applyType();

            assert.strictEqual(enemy.height, Enemy.height);
            assert.strictEqual(enemy.width, Enemy.width);
            assert.strictEqual(enemy.lifes, 1);
            assert.strictEqual(enemy.shootTimer, 160);
            assert.ok(enemy.speedX <= -1 && enemy.speedX >= -2);
            assert.strictEqual(enemy.speedY, 5);
            assert.strictEqual(enemy.value, 12);
        });

        it('should set properties correctly for type "orange"', () => {
            enemy.type = 'orange';
            enemy.difficulty = 1;
            enemy.applyType();

            assert.strictEqual(enemy.height, Enemy.height * 1.8);
            assert.strictEqual(enemy.width, Enemy.width * 1.8);
            assert.strictEqual(enemy.lifes, 1);
            assert.strictEqual(enemy.shootTimer, 160);
            assert.ok(enemy.speedX <= -1 && enemy.speedX >= -2);
            assert.ok(enemy.speedY <= 1 && enemy.speedY >= -1);
            assert.strictEqual(enemy.value, 20);
        });

        it('should set properties correctly for type "darkred"', () => {
            enemy.type = 'darkred';
            enemy.difficulty = 1;
            enemy.applyType();


            assert.strictEqual(enemy.lifes, 3);
            assert.strictEqual(enemy.shootTimer, 160);
            assert.strictEqual(enemy.speedX, -1);
            assert.strictEqual(enemy.speedY, 0);
            assert.strictEqual(enemy.value, 25);
        });

        it('should set properties correctly for type "boss"', () => {
            enemy.type = 'boss';
            enemy.difficulty = 1;
            enemy.applyType();

            assert.strictEqual(enemy.height, Enemy.height * 5);
            assert.strictEqual(enemy.width, Enemy.width * 5);
            assert.strictEqual(enemy.lifes, 25);
            assert.strictEqual(enemy.shootTimer, 80);
            assert.strictEqual(enemy.speedX, -0.9);
            assert.ok(enemy.speedY <= 1 && enemy.speedY >= -1);
            assert.strictEqual(enemy.value, 50);
        });
    });

    describe('update', () => {
        it('should update ennemy position x correctly', () => {
            const enemy = new Enemy(100, 100, 1);
            const entitySpeedMultiplier = 2;
            let oldPosX = enemy.posX;
            enemy.update(null, entitySpeedMultiplier);
            let newPosX = oldPosX + enemy.speedX * entitySpeedMultiplier;
            newPosX = Math.round(newPosX * 100) / 100;
            assert.strictEqual(enemy.posX, newPosX);
        });
        it('should update ennemy position y correctly', () => {
            const enemy = new Enemy(100, 100, 1);
            const entitySpeedMultiplier = 2;
            let oldPosY = enemy.posY;
            enemy.update(null, entitySpeedMultiplier);
            let newPosY = oldPosY + enemy.speedY * entitySpeedMultiplier;
            newPosY = Math.round(newPosY * 100) / 100;
            assert.strictEqual(enemy.posY, newPosY);
        });
    });
});
