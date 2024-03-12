import View from './view.js';

export default class GameOver extends View {
	constructor(element) {
		super(element);
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
