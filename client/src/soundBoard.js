import Entity from "../../server/entity.js";

export default class SoundBoard {

    static playerDeathPath = './public/res/sounds/dead.mp3';
    static playerShotPath = './public/res/sounds/shot.mp3';

	

	constructor() {
        this.playerShot = new Audio(SoundBoard.playerShotPath);
        this.playerDeath = new Audio(SoundBoard.playerDeathPath);
    }

    playSound(sound){
        sound.cloneNode(true).play();
    }

    playSoundPlayerDeath(){
        this.playSound(this.playerDeath);
    }

    playSoundPlayerShooting(){
        this.playSound(this.playerShot);
    }
}




