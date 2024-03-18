import View from './gameView.js';
export default class HomePage extends View {
	username;
	constructor(element) {
		super(element);
		this.element = element;
		this.username = '';
		this.show();
	}

	show() {
		this.element.classList.add('active');
	}

	Play() {
		this.username = this.element.querySelector('input[type="text"]').value;
		this.hide();
	}
}
