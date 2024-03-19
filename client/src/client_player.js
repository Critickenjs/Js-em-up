import Client_Entity from './client_entity.js';
export default class Client_Player extends Client_Entity {
	static width = 50;
	static height = 50;

	constructor(posX, posY, pseudo, invincible) {
		super(posX, posY, Client_Player.width, Client_Player.height);
		this.pseudo = pseudo;
		this.invincible = invincible;

		this.maxAnimationTime = 50;
		this.animationTime = this.maxAnimationTime;
		this.image = new Image();
		this.image.src = './public/res/images/spaceship.png';
		this.imageShield = new Image();
		this.imageShield.src = './public/res/images/shield.png';
		this.imageShield2 = new Image();
		this.imageShield2.src = './public/res/images/shield2.png';
	}

	render(context) {
		super.render(context);
		context.beginPath();
		context.drawImage(
			this.image,
			this.posX,
			this.posY,
			this.width,
			this.height
		);
		if (this.invincible >= 0) {
			if (this.animationTime < 0) {
				this.animationTime = this.maxAnimationTime;
			} else {
				this.animationTime--;
			}
			if (this.animationTime > this.maxAnimationTime / 2) {
				context.drawImage(
					this.imageShield2,
					this.posX - this.width / 4,
					this.posY - this.height / 4,
					this.width * 1.5,
					this.height * 1.5
				);
			} else {
				context.drawImage(
					this.imageShield,
					this.posX - this.width / 4,
					this.posY - this.height / 4,
					this.width * 1.5,
					this.height * 1.5
				);
			}

			console.log('timer invincible : ', this.invincible);
			console.log('timer animation : ', this.animationTime);
		}
	}
}
