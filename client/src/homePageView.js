import View from './view.js';
export default class HomePage extends View {
	username;
	constructor(element, onPhone) {
		super(element);
		this.username = '';
		this.show();
		this.onPhone = onPhone;
	}

	show() {
		if (this.onPhone) {
			this.element.querySelector('.switch').style.display = 'none';
		} else {
			this.element.querySelector('.switch').style.display = 'block';
		}
	}

	Play() {
		this.username = this.element.querySelector('input[type="text"]').value;
		this.code = this.element.querySelector('input[type="code"]').value;
		this.hide();
	}

	hide() {
		this.element.style.display = 'none';
	}
}
