import Client_Entity from './client_entity.js';
export default class Client_Player extends Client_Entity {
	static width = 50;
	static height = 50;
	static pseudo;



	constructor(posX, posY, pseudo, invincible, score, scoreMultiplier) {
		super(posX, posY, Client_Player.width, Client_Player.height);
		this.pseudo = pseudo;
		this.invincible = invincible;
		this.isAlive = false;
		this.score = score;
		this.scoreMultiplier = scoreMultiplier;

		//Animation
		this.maxAnimationTime = 30;
		this.minAnimationTime = 10;
		this.animationTime = this.maxAnimationTime;

		//Image
		this.image = new Image();
		this.image.src = './public/res/images/spaceship.png';
		this.imageShield = new Image();
		this.imageShield.src = './public/res/images/shield.png';
		this.imageShield2 = new Image();
		this.imageShield2.src = './public/res/images/shield2.png';
	}

	render(context) {
		if (this.isAlive) {
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
				if (this.animationTime > 0) {
					this.animationTime--;
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
				} else {
					this.maxAnimationTime = (this.invincible / 10) | 0;
					if (this.maxAnimationTime < this.minAnimationTime)
						this.maxAnimationTime = this.minAnimationTime;
					this.animationTime = this.maxAnimationTime;
				}
			}
			Client_Player.showMessage(
				context,
				this.pseudo,
				'16px',
				'white',
				this.posX,
				this.posY - 10
			);
		}
	}

	static showMessage(context, msg, size, color, posX, posY) {
		context.fillStyle = color;
		context.font = size + " 'Minecraft regular'";
		context.fillText(msg, posX, posY);
	}
}
