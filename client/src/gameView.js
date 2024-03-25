import View from './view.js';

export default class GameView extends View {
	constructor(element) {
		super(element);
	}
	show() {
		this.element.style.display = 'flex';
		this.element
			.querySelector('.score')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.waves')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.lifes')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.time')
			.setAttribute('style', 'display : block;');
	}
	hide() {
		this.element.style.display = 'none';
		this.element
			.querySelector('.score')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.waves')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.lifes')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.time')
			.setAttribute('style', 'display : none;');
	}

	setScore(score) {
		this.element.querySelector('.scoreValue').textContent = score;
	}
	setWaves(waves) {
		this.element.querySelector('.wavesValue').textContent = waves;
	}
	setLifes(lifes) {
		this.element.querySelector('.lifesValue').textContent = lifes;
	}
	setTime(time) {
		this.element.querySelector('.timeValue').textContent = time;
	}
}
