import View from './view.js';
export default class HomePage extends View {
	username;
	constructor(element) {
		super(element);
		this.element = element;
		this.username = '';
		this.show();
	}

	show() {
		this.element
			.querySelector('.score')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.waves')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.time')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.lifes')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : none;');
	}

	Play() {
		this.username = this.element.querySelector('input[type="text"]').value;
		this.element.querySelector('.HomePage').classList.remove('active');
		this.element
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : block;');

		this.element
			.querySelector('.score')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.waves')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.time')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.lifes')
			.setAttribute('style', 'display : block;');
	}
}
