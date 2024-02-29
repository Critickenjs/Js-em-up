import { Player } from './player.js';
export default class GameOver {
	constructor(player) {
		this.player = player;
		this.scoreElement = document.querySelector('#scoreValue');
		this.restartButton = document.querySelector('#restartButton');
		this.element = document.querySelector('.gameOver');
	}
	show() {
		this.element.style.display = 'flex';
	}

	hide() {
		this.element.style.display = 'none';
	}

	restartGame(canvas) {
		this.hide();
		this.player.restart(canvas);
		document.querySelector('#scoreValue').innerHTML = this.player.score;
	}
}
