import View from './view.js';

export default class GameOverView extends View {
	constructor(element) {
		super(element);
		this.score = 0;
	}
	show(score) {
		super.show('flex');
		this.setScore(score);
	}
	hide() {
		super.hide();
	}
	setScore(score) {
		this.score = score;
		this.element.querySelector('.scoreValue').textContent = score;
	}
}
