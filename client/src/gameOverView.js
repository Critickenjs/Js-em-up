import View from './gameView.js';

export default class GameView extends View {
	constructor(element) {
		super(element);
	}
	show() {
		this.element.style.display = 'flex';
	}
	hide() {
		this.element.style.display = 'none';
	}
}
