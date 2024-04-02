import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Power from '../power.js';

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
        it('should update properties correctly', () => {

        });
    });

    describe('powerActivation', () => {
        it('should activate correctly', () => {

        });
    });


});