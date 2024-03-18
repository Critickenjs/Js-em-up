import View from './gameView.js';

export default class GameOver extends View {
	constructor(element) {
		this.element = element;
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
