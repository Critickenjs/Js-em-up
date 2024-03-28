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
});