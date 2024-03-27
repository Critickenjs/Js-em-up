import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import GameData from '../gameData.js';

describe('GameData', () => {
    describe('resetAllData', () => {
        it('should reset all data correctly', () => {
            const gameData = new GameData();
            gameData.resetAllData();

            assert.strictEqual(gameData.wavesNumber, 1);
            assert.strictEqual(gameData.teamLifes, 1);
            assert.strictEqual(gameData.entitySpeedMultiplier, 1);
            assert.strictEqual(gameData.isInGame, true);
        });
    });
});