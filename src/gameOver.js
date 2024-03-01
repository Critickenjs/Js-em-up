export default class GameOver {
	constructor() {
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

	restartGame() {
		this.hide();
	}
}
