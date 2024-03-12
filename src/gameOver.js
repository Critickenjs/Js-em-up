import View from './view.js';

export default class GameOver extends View {
	constructor(element) {
		super(element);
		this.element = element;
	}
	show() {
		this.element.style.display = 'flex';
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

	hide() {
		this.element.style.display = 'none';
	}

	restartGame() {
		this.hide();
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
}
