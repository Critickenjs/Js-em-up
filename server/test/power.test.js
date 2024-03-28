import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Power from '../power.js';

describe('Power', () => {
    describe('types', () => {
        it('should contain the correct types', () => {
            const expectedTypes = [
                'laser',
                'perforation',
                'ice',
                'invincible',
                'scoreMultiplierBonus',
                'life',
            ];

            assert.deepStrictEqual(Power.types, expectedTypes);
        });
    });
});