import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Entity from '../entity.js';

describe('Entity', () => {
    it('should initialize properties correctly', () => {
        const posX = 10;
        const posY = 20;
        const width = 30;
        const height = 40;

        const entity = new Entity(posX, posY, width, height);

        assert.strictEqual(entity.posX, posX);
        assert.strictEqual(entity.posY, posY);
        assert.strictEqual(entity.speedX, 0);
        assert.strictEqual(entity.speedY, 0);
        assert.strictEqual(entity.width, width);
        assert.strictEqual(entity.height, height);
        assert.deepStrictEqual(entity.collision, {
            topLeft: [posX, posY],
            topRight: [posX + width, posY],
            bottomLeft: [posX, posY + height],
            bottomRight: [posX + width, posY + height],
        });
    });

    describe('update', () => {
        it('should update position x of entities correctly', () => {
            const entity = new Entity(100, 100, 10, 10);
            entity.speedX = 2;
            const entitySpeedMultiplier = 2;
            let oldPosX = entity.posX;
            entity.update(entitySpeedMultiplier);
            let newPosX = oldPosX + entity.speedX * entitySpeedMultiplier;
            newPosX = Math.round(newPosX * 100) / 100;
            assert.strictEqual(entity.posX, newPosX);
        });
        it('should update position y of entities correctly', () => {
            const entity = new Entity(100, 100, 10, 10);
            entity.speedY = 2;
            const entitySpeedMultiplier = 2;
            let oldPosY = entity.posY;
            entity.update(entitySpeedMultiplier);
            let newPosY = oldPosY + entity.speedY * entitySpeedMultiplier;
            newPosY = Math.round(newPosY * 100) / 100;
            assert.strictEqual(entity.posY, newPosY);
        });
        it('should update collision of entities correctly', () => {
            const entity = new Entity(100, 100, 10, 10);
            entity.speedX = 2;
            entity.speedY = 2;
            const entitySpeedMultiplier = 2;
            entity.update(entitySpeedMultiplier);
            assert.deepStrictEqual(entity.collision, {
                topLeft: [entity.posX, entity.posY],
                topRight: [entity.posX + entity.width, entity.posY],
                bottomLeft: [entity.posX, entity.posY + entity.height],
                bottomRight: [entity.posX + entity.width, entity.posY + entity.height],
            });
        });
    });

    describe('checkBorderCollision', () => {
        it('should set posX and speedX to 0 when posX is less than 0', () => {
            const entity = new Entity(100, 100, 10, 10);
            entity.posX = -10;
            entity.speedX = 2;

            entity.checkBorderCollision();

            assert.strictEqual(entity.posX, 0);
            assert.strictEqual(entity.speedX, 0);
        });

        it('should set posX and speedX to canvasWidth - width when posX is greater than canvasWidth - width', () => {
            const entity = new Entity(100, 100, 10, 10);
            entity.posX = 300;
            entity.speedX = 2;
            Entity.canvasWidth = 200;

            entity.checkBorderCollision();

            assert.strictEqual(entity.posX, 200 - 10);
            assert.strictEqual(entity.speedX, 0);
        });

        it('should set posY and speedY to 0 when posY is less than 0', () => {
            const entity = new Entity(100, 100, 10, 10);
            entity.posY = -10;
            entity.speedY = 2;

            entity.checkBorderCollision();

            assert.strictEqual(entity.posY, 0);
            assert.strictEqual(entity.speedY, 0);
        });

        it('should set posY and speedY to canvasHeight - height when posY is greater than canvasHeight - height', () => {
            const entity = new Entity(100, 100, 10, 10);
            entity.posY = 300;
            entity.speedY = 2;
            Entity.canvasHeight = 200;

            entity.checkBorderCollision();

            assert.strictEqual(entity.posY, 200 - 10);
            assert.strictEqual(entity.speedY, 0);
        });
    });

    describe('checkEntityCollision', () => {
        it('should detect the other entity', () => {
            const entity = new Entity(100, 100, 10, 10);
            const entity2 = new Entity(200, 200, 10, 10);
            assert.strictEqual(entity.isCollidingWith(entity2), false);
            entity2.posX = 105;
            entity2.posY = 105;
            entity2.width = 505;
            entity2.height = 402;
            entity2.update(1);
            assert.strictEqual(entity.isCollidingWith(entity2), true);
        });
    });
});