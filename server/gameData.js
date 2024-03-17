import WavesManager from "./wavesManager.js";

export default class GameData{
	constructor() {
        this.players = [];  //{"id":'',"posX":x,"posY:y","score":0}
        this.enemys = [];  //{"posX":x,"posY:y","type":'red',"lifes":1}
        this.powers = [];  //{"posX":x,"posY:y","type":'life'}   
        this.shots = [];  //{"posX":x,"posY:y","isFromAPlayer":true,"perforation":false} 
        this.wavesNumber=1;
        this.entitySpeedMultiplier=1;
	}
}
