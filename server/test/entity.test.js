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
});