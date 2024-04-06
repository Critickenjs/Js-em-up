import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import WavesManager from '../wavesManager.js';
import Game from '../game.js';
import Enemy from '../enemy.js';
import Player from '../player.js';

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

    describe('interactions', () => {
        it('should update player and ennemies interactions correctly', () => {
            const game = new Game(1);
            game.players.set('player', new Player(100, 100, "Willy"));
            game.wavesManager.enemys.push(new Enemy(105, 105, 1));
            game.wavesManager.waveMaxNumberOfEnemys = 5;
            game.wavesManager.waveNumberOfEnemysSpawned = 5;
            game.players.get('player').invincible = false;
            assert.strictEqual(game.gameData.teamLifes, 3);
            assert.strictEqual(game.players.get('player').alive, true);
            assert.strictEqual(game.players.get('player').invincible, false);
            assert.strictEqual(game.wavesManager.enemys[0].isDead, false);
            game.wavesManager.updateEnnemiesToPlayersInteractions(game);
            assert.strictEqual(game.gameData.teamLifes, 2);
            assert.strictEqual(game.players.get('player').alive, false);
            assert.strictEqual(game.wavesManager.enemys[0].isDead, true);
        });
    });


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
            wavesManager.enemys.push(new Enemy(100, 101, 1));
            wavesManager.nextWave(1);

            assert.strictEqual(wavesManager.hasABoss, false);
            assert.strictEqual(wavesManager.waveNumber, 2);
            assert.strictEqual(wavesManager.waveNumberOfEnemysSpawned, 1);
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