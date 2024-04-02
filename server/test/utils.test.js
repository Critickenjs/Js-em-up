import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getRandomInt, getRandomIntWithMin, getRandomIntWithMinPositive } from '../utils.js';

describe('getRandomInt', () => {
    it('should get number between 0 and the parameter', () => {
        let randomNb = 0;
        for (let i = 0; i < 100; i++) {
            randomNb = getRandomInt(100);
            assert(randomNb >= 0);
            assert(randomNb < 100);
        }
    });
});

describe('getRandomIntWithMin', () => {
    it('should get number between min and max', () => {
        let randomNb = 0;
        let min = 1;
        let max = 5;
        for (let i = 0; i < 100; i++) {
            randomNb = getRandomIntWithMin(min, max);
            assert(randomNb >= min);
            assert(randomNb <= max);
        }
        min = -1;
        max = 1;
        for (let i = 0; i < 100; i++) {
            randomNb = getRandomIntWithMin(min, max);
            assert(randomNb >= min);
            assert(randomNb <= max);
        }
    });
});

describe('getRandomIntWithMinPositive', () => {
    it('should get number between min and max', () => {
        let randomNb = 0;
        const min = 50;
        const max = 100;
        for (let i = 0; i < 100; i++) {
            randomNb = getRandomIntWithMinPositive(min, max);
            assert(randomNb >= min);
            assert(randomNb <= max);
        }
    });
});