import assert from 'node:assert/strict';
import Game from '../game.js';
import { describe, it } from 'node:test';

describe('Game', () => {
    describe('checkPlayerRespawn', () => {


        it('should delete player if player entry is null', () => {
            const game = new Game();
            game.players.set('player1', null);

            game.checkPlayerRespawn();

            assert.strictEqual(game.players.has('player1'), false);
        });

    });
});
