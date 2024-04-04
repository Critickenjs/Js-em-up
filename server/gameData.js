import WavesManager from './wavesManager.js';

export default class GameData {
	constructor() {
		this.players = []; //{"id":'',"posX":x,"posY:y","pseudo":'name',"skin":0,"score":0,"invincible":4,"scoreMultiplier":1} //Invincible est le timer avant la fin de l'invinciblité
		this.enemys = []; //{"id":'',"posX":x,"posY:y","type":'red',"lifes":1}
		this.powers = []; //{"posX":x,"posY:y","type":'life'}
		this.shots = []; //{"posX":x,"posY:y","isFromAPlayer":true,"perforation":false,"tick":0}
		this.wavesNumber = 1;
		this.teamLifes = 1;
		this.entitySpeedMultiplier = 1;
		this.isInGame = false;
	}

	resetData() {
		this.players = []; //{"id":'',"posX":x,"posY:y","pseudo":'name',"skin":0,"score":0,"invincible":4,"scoreMultiplier":1} //Invincible est le timer avant la fin de l'invinciblité
		this.enemys = []; //{"id":'',"posX":x,"posY:y","type":'red',"lifes":1}
		this.powers = []; //{"posX":x,"posY:y","type":'life'}
		this.shots = []; //{"posX":x,"posY:y","isFromAPlayer":true,"perforation":false}
	}

	resetAllData() {
		this.resetData();
		this.wavesNumber = 1;
		this.teamLifes = 1;
		this.entitySpeedMultiplier = 1;
		this.isInGame = true;
	}
}
