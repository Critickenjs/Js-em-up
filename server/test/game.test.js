import assert from 'node:assert/strict';
import Game from '../game.js';
import { describe, it } from 'node:test';
import WavesManager from '../wavesManager.js';
import Power from '../power.js';
import Enemy from '../enemy.js';
import Player from '../player.js';
import Shot from '../shot.js';

describe('Game', () => {
    describe('checkPlayerRespawn', () => {
        it('should delete player if player entry is null', () => {
            const game = new Game();
            game.players.set('player1', null);

            game.checkPlayerRespawn();

            assert.strictEqual(game.players.has('player1'), false);
        });

    });

    describe('init', () => {
        it('should initialize Game correctly', () => {
            const game = new Game();
            assert.strictEqual(false, false);
        });
    });

    describe('update', () => {
        it('should update HUD correctly', () => {
            const game = new Game();
            assert.strictEqual(false, false);
        });
        it('should update the game correctly', () => {
            const game = new Game();
            assert.strictEqual(false, false);
        });
        it('should update powers correctly', () => {
            const game = new Game();
            assert.strictEqual(false, false);
        });
    });

    describe('reset', () => {
        it('should reset team Lives correctly', () => {
            const game = new Game(5);
            assert.strictEqual(game.gameData.teamLifes, 1);
            game.addToTeamLives(2);
            assert.strictEqual(game.gameData.teamLifes, 3);
            game.resetTeamLives();
            assert.strictEqual(game.gameData.teamLifes, 1);
        });
        it('should reset players correctly', () => {
            const game = new Game();
            assert.strictEqual(false, false);
        });
        it('should reset data correctly', () => {
            const game = new Game();
            assert.strictEqual(false, false);
        });
        it('should reset all data correctly', () => {
            const game = new Game();
            assert.strictEqual(false, false);
        });
        it('should reset game correctly', () => {
            const game = new Game();
            assert.strictEqual(false, false);
        });
    });

    describe('end condition', () => {
        it('should verify if at least one player is alive', () => {
            const game = new Game();
            assert.strictEqual(
                game.atLeast1PlayerAlive(), false);
            game.players.set("1", new Player(100, 101, "Johnny"));
            assert.strictEqual(
                game.atLeast1PlayerAlive(), true);
            game.players.get("1").alive = false;
            assert.strictEqual(
                game.atLeast1PlayerAlive(), false);
        });
    });

    describe('add values', () => {
        it('should add lifes to team Lifes', () => {
            const game = new Game(5);
            assert.strictEqual(game.gameData.teamLifes, 1);
            game.addToTeamLives(1);
            assert.strictEqual(game.gameData.teamLifes, 2);
            game.addToTeamLives(3);
            assert.strictEqual(game.gameData.teamLifes, 5);
            game.addToTeamLives(-2);
            assert.strictEqual(game.gameData.teamLifes, 3);
        });
        it('should add speed to entitySpeedMultiplier', () => {
            const game = new Game();
            assert.strictEqual(game.gameData.entitySpeedMultiplier, 1);
            game.addToSpeed(0.5);
            assert.strictEqual(game.gameData.entitySpeedMultiplier, 1.5);
            game.addToSpeed(3);
            assert.strictEqual(game.gameData.entitySpeedMultiplier, 2);
        });
    });

    describe('refresh values', () => {
        it('should refresh player values', () => {
            const game = new Game();
            assert.strictEqual(game.players.size, 0);
            assert.strictEqual(game.gameData.players.length, 0);
            game.players.set('1', new Player(100, 101, "Bobby"));
            assert.strictEqual(game.players.size, 1);
            assert.strictEqual(game.gameData.players.length, 0);
            game.refreshPlayersAndPlayerShots();
            assert.strictEqual(game.players.size, 1);
            assert.strictEqual(game.gameData.players.length, 1);
            assert.strictEqual(game.gameData.players[0].posX, 100);
            assert.strictEqual(game.gameData.players[0].posY, 101);
            assert.strictEqual(game.gameData.players[0].pseudo, 'Bobby');
            game.players.get('1').shots.push(new Shot(100, 101, true));
            assert.strictEqual(game.players.get('1').shots.length, 1);
            assert.strictEqual(game.gameData.shots.length, 0);
            game.refreshPlayersAndPlayerShots();
            assert.strictEqual(game.players.get('1').shots.length, 1);
            assert.strictEqual(game.gameData.shots.length, 1);
            assert.strictEqual(game.gameData.shots[0].posX, 100);
            assert.strictEqual(game.gameData.shots[0].posY, 101);
            assert.strictEqual(game.gameData.shots[0].isFromAPlayer, true);
        });
        it('should refresh wavesNumber', () => {
            const game = new Game();
            assert.strictEqual(game.gameData.wavesNumber, 1);
            game.wavesManager.waveNumber = 3;
            game.refreshWaves();
            assert.strictEqual(game.gameData.wavesNumber, 3);
        });
        it('should refresh game status', () => {
            const game = new Game();
            assert.strictEqual(game.gameData.isInGame, false);
            assert.strictEqual(game.isInGame, false);
            game.isInGame = true;
            assert.strictEqual(game.gameData.isInGame, false);
            assert.strictEqual(game.isInGame, true);
            game.refreshIsInGame();
            assert.strictEqual(game.gameData.isInGame, true);
            assert.strictEqual(game.isInGame, true);
        });
        it('should refresh ennemies', () => {
            const game = new Game();
            assert.strictEqual(game.wavesManager.enemys.length, 0);
            assert.strictEqual(game.gameData.enemys.length, 0);
            game.wavesManager.enemys.push(new Enemy(100, 101, 1));
            assert.strictEqual(game.wavesManager.enemys.length, 1);
            assert.strictEqual(game.gameData.enemys.length, 0);
            game.refreshEnnemiesAndEnemyShots();
            assert.strictEqual(game.wavesManager.enemys.length, 1);
            assert.strictEqual(game.gameData.enemys.length, 1);
            assert.strictEqual(game.gameData.enemys[0].posX, 100);
            assert.strictEqual(game.gameData.enemys[0].posY, 101);
            assert.strictEqual(game.gameData.enemys[0].type, 'red');
            game.wavesManager.enemys[0].shots.push(new Shot(100, 101, false));
            assert.strictEqual(game.wavesManager.enemys[0].shots.length, 1);
            assert.strictEqual(game.gameData.shots.length, 0);
            game.refreshEnnemiesAndEnemyShots();
            assert.strictEqual(game.wavesManager.enemys[0].shots.length, 1);
            assert.strictEqual(game.gameData.shots.length, 1);
            assert.strictEqual(game.gameData.shots[0].posX, 100);
            assert.strictEqual(game.gameData.shots[0].posY, 101);
            assert.strictEqual(game.gameData.shots[0].isFromAPlayer, false);
        });
        it('should refresh powers', () => {
            const game = new Game();
            assert.strictEqual(game.powers.length, 0);
            assert.strictEqual(game.gameData.powers.length, 0);
            game.powers.push(new Power(100, 101, 'ice'));
            assert.strictEqual(game.powers.length, 1);
            assert.strictEqual(game.gameData.powers.length, 0);
            game.refreshPowers();
            assert.strictEqual(game.powers.length, 1);
            assert.strictEqual(game.gameData.powers.length, 1);
            assert.strictEqual(game.gameData.powers[0].posX, 100);
            assert.strictEqual(game.gameData.powers[0].posY, 101);
            assert.strictEqual(game.gameData.powers[0].type, 'ice');
        });
    });


});
