import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import WavesManager from '../wavesManager.js';

describe('WavesManager', () => {
    describe('firstWave', () => {
        it('should initialize properties correctly', () => {
            const wavesManager = new WavesManager();
            wavesManager.firstWave(1);

            assert.strictEqual(wavesManager.waveNumber, 1);
            assert.strictEqual(wavesManager.waveMaxNumberOfEnemys, 3);
            assert.strictEqual(wavesManager.waveNumberOfEnemysSpawned, 5);
            assert.strictEqual(wavesManager.hasABoss, false);
        });
    });

    describe('nextWave', () => {
        it('should update properties correctly', () => {
            const wavesManager = new WavesManager();
            wavesManager.nextWave(1);

            assert.strictEqual(wavesManager.hasABoss, false);
            assert.strictEqual(wavesManager.waveNumber, 2);
            assert.strictEqual(wavesManager.waveNumberOfEnemysSpawned, 0);
            assert.strictEqual(wavesManager.waveMaxNumberOfEnemys, 5);
        });
    });





});
