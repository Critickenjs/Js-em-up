import assert from 'node:assert/strict';
import { describe, it, beforeEach } from 'node:test';
import Enemy from '../enemy.js';
import WavesManager from '../wavesManager.js';

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
    describe('getHurt', () => {
        it('should return true if enemy dies', () => {
            const enemy = new Enemy(100, 100, 1);
            const waveManager = new WavesManager();

            const result = enemy.getHurt(waveManager);

            assert.strictEqual(result, true);
        });

        it('should return false if enemy survives', () => {
            const enemy = new Enemy(100, 100, 1);
            const waveManager = new WavesManager();
            enemy.lifes = 2;

            const result = enemy.getHurt(waveManager);

            assert.strictEqual(result, false);
        });

        it('should decrease enemy lifes if hit', () => {
            const enemy = new Enemy(100, 100, 1);
            const waveManager = new WavesManager();
            waveManager.waveMaxNumberOfEnemys = 5;
            waveManager.waveNumberOfEnemysSpawned = 5;
            enemy.lifes = 2;
            assert.strictEqual(enemy.lifes, 2);
            enemy.getHurt(waveManager);
            assert.strictEqual(enemy.lifes, 1);
            assert.strictEqual(enemy.isDead, false);
            enemy.getHurt(waveManager);
            assert.strictEqual(enemy.lifes, 0);
            assert.strictEqual(enemy.isDead, true);
        });


    });

    describe('fate', () => {
        it('should respawn enemy if wave is not full', () => {
            const enemy = new Enemy(100, 100, 1);
            const waveManager = new WavesManager();
            waveManager.waveNumberOfEnemysSpawned = 4;

            enemy.fate(waveManager);

            assert.strictEqual(waveManager.waveNumberOfEnemysSpawned, 5);
            assert.strictEqual(enemy.isDead, false);
        });

        it('should kill enemy if wave is full', () => {
            const enemy = new Enemy(100, 100, 1);
            const waveManager = new WavesManager();
            waveManager.waveNumberOfEnemysSpawned = 10;

            enemy.fate(waveManager);

            assert.strictEqual(enemy.isDead, true);
        });
    });

    describe('respawn', () => {
        it('should reset enemy properties', () => {
            const enemy = new Enemy(100, 100, 1);
            const waveManager = new WavesManager();
            const initialPosX = enemy.posX;
            const initialPosY = enemy.posY;
            const initialType = enemy.type;

            enemy.respawn(waveManager);

            assert.strictEqual(enemy.isDead, false);

        });
    });



});
