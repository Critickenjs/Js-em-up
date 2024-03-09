export default class GameOver {
	constructor() {
		this.scoreElement = document.querySelector('#scoreValue');
		this.restartButton = document.querySelector('#restartButton');
		this.element = document.querySelector('.gameOver');
	}
	show() {
		this.element.style.display = 'flex';
		document.querySelector('.score').setAttribute('style', 'display : none;');
		document.querySelector('.waves').setAttribute('style', 'display : none;');
		document.querySelector('.lifes').setAttribute('style', 'display : none;');
		document.querySelector('.time').setAttribute('style', 'display : none;');
	}

	hide() {
		this.element.style.display = 'none';
	}

	restartGame() {
		this.hide();
		document.querySelector('.score').setAttribute('style', 'display : block;');
		document.querySelector('.waves').setAttribute('style', 'display : block;');
		document.querySelector('.lifes').setAttribute('style', 'display : block;');
		document.querySelector('.time').setAttribute('style', 'display : block;');
	}
}
