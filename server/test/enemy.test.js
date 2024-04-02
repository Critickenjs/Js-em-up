import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import Enemy from '../enemy.js';

describe('Enemy', () => {
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
