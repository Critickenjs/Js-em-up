import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import Player from '../player.js';

describe('Player', () => {
    describe('update', () => {
        it('should update player properties correctly', () => {
            const player = new Player(0, 0);
            const keysPressed = {
                Space: true,
                MouseDown: false,
            };
            const entitySpeedMultiplier = 2;

            player.update(keysPressed, entitySpeedMultiplier);

            assert.strictEqual(player.speedX, 0);
            assert.strictEqual(player.speedY, 0);
            assert.strictEqual(player.timerBeforeLosingScoreMultiplierBonus, 0);
            assert.strictEqual(player.timerBeforeLosingIceMalus, 0);
            assert.strictEqual(player.timerBeforeLosingPerforationBonus, 0);
            assert.strictEqual(player.timerBeforeLosingLaserBonus, 0);
            assert.strictEqual(player.timerBeforeShots, 9);
            assert.strictEqual(player.invincible, true);
        });

        it('should update player position based on input keys', () => {
            const player = new Player(0, 0);
            const keysPressed = {
                ArrowUp: true,
                ArrowLeft: true,
            };
            const entitySpeedMultiplier = 1;

            player.update(keysPressed, entitySpeedMultiplier);

            assert.strictEqual(player.posX, 0);
            assert.strictEqual(player.posY, 0);
        });

        it('should handle border collision correctly', () => {
            const canvasWidth = 800;
            const canvasHeight = 600;
            const player = new Player(canvasWidth - 50, canvasHeight - 50);
            const keysPressed = {
                ArrowRight: true,
                ArrowDown: true,
            };
            const entitySpeedMultiplier = 1;

            player.update(keysPressed, entitySpeedMultiplier);

            assert.strictEqual(player.posX, 753.18);
            assert.strictEqual(player.posY, canvasHeight - player.height);
        });
    });

    it('should correctly handle invincibility duration', () => {
        const player = new Player(0, 0);
        const keysPressed = {};
        const entitySpeedMultiplier = 1;

        player.becomeInvincible(60);
        player.update(keysPressed, entitySpeedMultiplier);

        assert.strictEqual(player.invincible, true);


        for (let i = 0; i < 30; i++) {
            player.update(keysPressed, entitySpeedMultiplier);
        }

        assert.strictEqual(player.invincible, true);


        for (let i = 0; i < 31; i++) {
            player.update(keysPressed, entitySpeedMultiplier);
        }

        assert.strictEqual(player.invincible, false);
    });
    describe('playerShotsCollideWithEnemy', () => {
        it('should handle collision between player shots and enemy', () => {
            const player = new Player(0, 0);
            const enemy = { isCollidingWith: () => true, getHurt: () => true };
            const shot = { active: true, perforation: false };
            player.shots = [shot];
            assert.strictEqual(shot.active, true);
        });
    });

    describe('addScorePointOnEnemyKill', () => {
        it('should add score points and increment kills on enemy kill', () => {
            const player = new Player(0, 0);
            const enemy = { value: 10, difficulty: 5 };
            player.addScorePointOnEnemyKill(enemy);
            assert.strictEqual(player.score, (enemy.value + enemy.difficulty) * player.scoreMultiplierBonus);
            assert.strictEqual(player.kills, 1);
        });
    });




    describe('loseScoreMuliplierBonus', () => {
        it('should reset score multiplier bonus to 1', () => {
            const player = new Player(0, 0);
            player.scoreMultiplierBonus = 2;
            player.loseScoreMuliplierBonus();
            assert.strictEqual(player.scoreMultiplierBonus, 1);
        });
    });

    describe('shoot', () => {
        it('should add a shot to player shots array without perforation bonus', () => {
            const player = new Player(0, 0);
            player.shots = [];
            player.shoot();
            assert.strictEqual(player.shots.length, 1);
            assert.strictEqual(player.shots[0].perforation, false);
        });

        it('should add multiple shots when triShot bonus is active', () => {
            const player = new Player(0, 0);
            player.shots = [];
            player.obtainTriShotBonus(100);
            player.shoot();
            assert.strictEqual(player.shots.length, 3);
        });
    });

    describe('shootLaser', () => {
        it('should add a laser shot if no existing laser shot', () => {
            const player = new Player(0, 0);
            player.shots = [];
            player.shootLaser();
            assert.strictEqual(player.shots.length, 1);
            assert.strictEqual(player.shots[0].laser, true);
        });
    });

    describe('accelerateLeft', () => {
        it('should correctly decrease acceleration when moving left', () => {
            const player = new Player(0, 0);
            const acceleration = 5;
            const result = player.accelerateLeft(acceleration);
            assert.strictEqual(result, 4.82);
        });

        describe('accelerateUp', () => {
            it('should correctly decrease acceleration when moving up', () => {
                const player = new Player(0, 0);
                const acceleration = 5;
                const result = player.accelerateUp(acceleration);
                assert.strictEqual(result, 4.82);
            });
        });

        describe('accelerateRight', () => {
            it('should correctly increase acceleration when moving right', () => {
                const player = new Player(0, 0);
                const acceleration = 5;
                const result = player.accelerateRight(acceleration);
                assert.strictEqual(result, 5.18);
            });
        });

        describe('accelerateDown', () => {
            it('should correctly increase acceleration when moving down', () => {
                const player = new Player(0, 0);
                const acceleration = 5;
                const result = player.accelerateDown(acceleration);
                assert.strictEqual(result, 5.18);
            });
        });

        describe('decelerate', () => {
            it('should correctly decrease acceleration', () => {
                const player = new Player(0, 0);
                const acceleration = 5;
                const result = player.decelerate(acceleration);
                assert.strictEqual(result, 4.917);
            });
        });

        describe('keyBoardMovement', () => {
            it('should update player speed and acceleration based on keyboard input', () => {
                const player = new Player(0, 0);
                const keysPressed = {
                    ArrowUp: true,
                    ArrowLeft: true,
                };
                player.keyBoardMovement(keysPressed);
                assert.strictEqual(player.speedX, -Player.defaultSpeed);
                assert.strictEqual(player.speedY, -Player.defaultSpeed);
            });
        });

        describe('mouseMovement', () => {
            it('should update player speed and acceleration based on mouse input', () => {
                const player = new Player(0, 0);
                const keysPressed = {
                    MouseX: 50,
                    MouseY: 50,
                };
                player.mouseMovement(keysPressed);
                assert.strictEqual(player.speedX, Player.defaultSpeed);
                assert.strictEqual(player.speedY, Player.defaultSpeed);
            });
        });
    });

    describe('respawn', () => {
        it('should reset player properties and set invincibility after respawn', () => {
            const player = new Player(50, 50);
            player.alive = false;
            player.timerBeforeLosingIceMalus = 10;
            player.timerBeforeLosingLaserBonus = 15;
            player.timerBeforeLosingPerforationBonus = 20;
            player.timerBeforeLosingScoreMultiplierBonus = 25;
            player.timerBeforeLosingTriShotBonus = 30;

            const difficulty = 3;
            player.respawn(difficulty);

            assert.strictEqual(player.alive, true);
            assert.strictEqual(player.posX, 100);
            assert.strictEqual(player.posY, Player.canvasHeight / 2);
            assert.strictEqual(player.speedX, 0);
            assert.strictEqual(player.speedY, 0);
            assert.strictEqual(player.accelerationX, 0);
            assert.strictEqual(player.accelerationY, 0);
            assert.strictEqual(player.timerBeforeShots, 0);
            assert.strictEqual(player.timerBeforeLosingIceMalus, 0);
            assert.strictEqual(player.timerBeforeLosingLaserBonus, 0);
            assert.strictEqual(player.timerBeforeLosingPerforationBonus, 0);
            assert.strictEqual(player.timerBeforeLosingScoreMultiplierBonus, 0);
            assert.strictEqual(player.timerBeforeLosingTriShotBonus, 0);
            assert.strictEqual(player.timerBeforeRespawn, player.maxTimeBeforeRespawn);
            assert.strictEqual(player.invincible, true);
            assert.strictEqual(player.timerBeforeLosingInvincibility, Player.maxTimeForInvincibility + Math.floor(300 / difficulty));
        });
    });

    describe('#shootWithRecharge()', () => {
        it('should reset the shot timer and shoot if the timer is expired', () => {
            const player = new Player(50, 50);

            player.timerBeforeShots = 0;

            player.shootWithRecharge();

            assert.strictEqual(player.timerBeforeShots, Player.maxTimeBeforeShooting);
        });
    });
});


