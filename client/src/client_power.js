import Client_Entity from './client_entity.js';
export default class Client_Power extends Client_Entity {
	static width = 40;
	static height = 40;

	static powers = [];

	constructor(posX, posY, type) {
		super(posX, posY, Client_Power.width, Client_Power.height);
		this.type = type;
		this.imageBonusShield = new Image();
		this.imageBonusShield.src = './public/res/images/bonusShield.png';
		this.imageBonusLife = new Image();
		this.imageBonusLife.src = './public/res/images/bonusLife.png';
		this.imageBonusArrows = new Image();
		this.imageBonusArrows.src = './public/res/images/bonusArrows.png';
		this.imageIce = new Image();
		this.imageIce.src = './public/res/images/ice.png';
		this.imageBonusLaser = new Image();
		this.imageBonusLaser.src = './public/res/images/bonusLaser.png';
		this.imageBonusPerforation = new Image();
		this.imageBonusPerforation.src = './public/res/images/bonusPerforation.png';
		this.imageBonusTrishot = new Image();
		this.imageBonusTrishot.src = './public/res/images/bonusTriShot.png';
	}

	render(context) {
		super.render(context);
		context.beginPath();
		switch (this.type) {
			case 'invincible':
				context.drawImage(
					this.imageBonusShield,
					this.posX,
					this.posY,
					this.width,
					this.height
				);
				break;
			case 'life':
				context.drawImage(
					this.imageBonusLife,
					this.posX,
					this.posY,
					this.width,
					this.height
				);
				break;
			case 'scoreMultiplierBonus':
				context.drawImage(
					this.imageBonusArrows,
					this.posX,
					this.posY,
					this.width,
					this.height
				);
				break;
			case 'ice':
				context.drawImage(
					this.imageIce,
					this.posX,
					this.posY,
					this.width,
					this.height
				);
				break;
			case 'laser':
				context.drawImage(
					this.imageBonusLaser,
					this.posX,
					this.posY,
					this.width,
					this.height
				);
				break;
			case 'perforation':
				context.drawImage(
					this.imageBonusPerforation,
					this.posX,
					this.posY,
					this.width,
					this.height
				);
				break;
			case 'trishot':
				context.drawImage(
					this.imageBonusTrishot,
					this.posX,
					this.posY,
					this.width,
					this.height
				);
				break;
			default:
				context.strokeStyle = 'yellow';
				context.rect(this.posX, this.posY, this.width, this.height);
				context.stroke();
				break;
		}
	}
}
