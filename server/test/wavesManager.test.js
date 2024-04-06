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

        it('should initialize properties correctly with different difficulty', () => {
            const wavesManager = new WavesManager();
            wavesManager.firstWave(2);

            assert.strictEqual(wavesManager.waveNumber, 1);
            assert.strictEqual(wavesManager.waveMaxNumberOfEnemys, 6);
            assert.strictEqual(wavesManager.waveNumberOfEnemysSpawned, 10);
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

        it('should update properties correctly with different difficulty', () => {
            const wavesManager = new WavesManager();
            wavesManager.nextWave(2);

            assert.strictEqual(wavesManager.hasABoss, false);
            assert.strictEqual(wavesManager.waveNumber, 2);
            assert.strictEqual(wavesManager.waveNumberOfEnemysSpawned, 0);
            assert.strictEqual(wavesManager.waveMaxNumberOfEnemys > 5, true);
        });
    });

    describe('wavesUpdates', () => {
        it('should update enemies and return false if not all enemies are dead', () => {
            const wavesManager = new WavesManager();
            wavesManager.firstWave(1);
            const game = {
                players: new Map(),
            };
            const entitySpeedMultiplier = 1;

            const result = wavesManager.wavesUpdates(game, entitySpeedMultiplier);

            assert.strictEqual(result, false);
        });

        it('should update enemies and return true if all enemies are dead', () => {
            const wavesManager = new WavesManager();
            wavesManager.firstWave(1);
            const game = {
                players: new Map(),
            };
            const entitySpeedMultiplier = 1;

            wavesManager.enemys.forEach((enemy) => {
                enemy.isDead = true;
            });

            const result = wavesManager.wavesUpdates(game, entitySpeedMultiplier);

            assert.strictEqual(result, true);
        });
    });
});