import Entity from "../../server/entity.js";

export default class SoundBoard {

    static playerDeathPath = './public/res/sounds/dead.mp3';
    static playerShotPath = './public/res/sounds/shot.mp3';
    static enemyShotPath = './public/res/sounds/shotEnemy.mp3';
    static enemyDeathPath = './public/res/sounds/enemyDeath.mp3';
    static powerPath = './public/res/sounds/power.mp3';
    static laserPath = './public/res/sounds/laser.mp3';
    static buttonPath = './public/res/sounds/button.mp3';
    static musicPath = './public/res/music/music.mp3';

    constructor() {
        this.sounds = new Map();
        this.sounds.set("playerShot", new Audio(SoundBoard.playerShotPath));
        this.sounds.set("playerDeath", new Audio(SoundBoard.playerDeathPath));
        this.sounds.set("enemyShot", new Audio(SoundBoard.enemyShotPath));
        this.sounds.set("enemyDeath", new Audio(SoundBoard.enemyDeathPath));
        this.sounds.set("power", new Audio(SoundBoard.powerPath));
        this.sounds.set("laser", new Audio(SoundBoard.laserPath));
        this.sounds.set("button", new Audio(SoundBoard.buttonPath));
        this.sounds.set("music", new Audio(SoundBoard.musicPath));
        this.sounds.get("music").loop = true;
    }

    playSound(sound) {
        sound.cloneNode(true).play();
    }

    playSoundWithKey(key) {
        this.playSound(this.sounds.get(key));
    }

    playSoundPlayerDeath() {
        this.playSound(this.sounds.get("playerDeath"));
    }

    playSoundPlayerShooting() {
        this.playSound(this.sounds.get("playerShot"));
    }

    playSoundEnemyShooting() {
        this.playSound(this.sounds.get("enemyShot"));
    }

    playSoundEnemyDeath() {
        this.playSound(this.sounds.get("enemyDeath"));
    }

    playSoundButton() {
        this.playSound(this.sounds.get("button"));
    }

    playSoundPowerUp() {
        this.playSound(this.sounds.get("power"));
    }

    playSoundLaser() {
        this.sounds.get("laser").play();
    }

    playMusic() {
        this.playSound(this.sounds.get("music"));
    }

    stopMusic() {
        this.sounds.get("music").pause();
        this.sounds.get("music").currentTime = 0;
    }
}




