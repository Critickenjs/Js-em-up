import View from './gameView.js';

export default class GameView extends View {
	constructor(element) {
		super(element);
	}
	show(score) {
		this.element.style.display = 'flex';
		this.setScore(score);
	}
	hide() {
		this.element.style.display = 'none';
	}
	setScore(score) {
		this.element.querySelector('.scoreValue').textContent = score;
	}
}
