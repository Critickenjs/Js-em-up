import { Entity } from './entity.js';
import { getRandomInt } from './utils.js';
import { Player } from './player.js';
import canvas from './main.js';
import { WavesManager } from './wavesManager.js';
export class Power extends Entity {
	static radius = 30;
    static speed = 6;
    static types = ['invincible','life','ScoreMultiplierBonus','ice'];//'fastShots','perforation' -> plus de limite de tirs et passe au travers des ennemis
    static powers = [];
	constructor(posX, posY, type=Power.types[getRandomInt(Power.types.length)]) {
		super(posX, posY, Power.radius, Power.radius);
		this.speedX = -Power.speed;
		this.speedY = 0;
		this.active = true;
        this.type=type;
	}
	
	render() {
        if(this.active){
            const context = canvas.getContext('2d');
            context.beginPath();
            context.lineWidth = 3;
            context.strokeStyle = 'purple';
            context.arc(this.posX+Power.radius/2, this.posY+Power.radius/2, Power.radius/2, 0, 2 * Math.PI);
            context.stroke();
        }
	}
    
	update() {
        super.update();
        if(this.posX<0-Power.radius){
            Power.powers.shift();
        }
	}

    powerCollideWithPlayer(player){
        if(this.active){
            if (this.isCollidingWith(player)){
                this.active=false;
                switch(this.type){
                    case('invincible'):
                        player.becomeInvincible(Player.maxTimeForInvincibility*((WavesManager.difficultyMax+1)-WavesManager.difficulty));
                    break;
                    case('life'):
                       Player.teamLifes++;
                       console.log('Vous gagnez une vie suplémentaire !');
                       document.querySelector('#lifesValue').innerHTML = Player.teamLifes;
                    break;
                    case('ScoreMultiplierBonus'):
                        player.obtainScoreMultiplierBonus();
                    break;
                    case('ice'):
                        player.obtainIceMalus();
                    break;
                }
            };
        }
    }
}
