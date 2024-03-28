import View from './view.js';
export default class HomePage extends View {
	username;
	constructor(element, onPhone) {
		super(element);
		this.username = '';
		this.show();
		this.onPhone = onPhone;
		this.joinGame = false;
		this.toggleMenu();
		this.code = '';
	}

	show() {
		if (this.onPhone) {
			this.element.querySelector('.switch').style.display = 'none';
		} else {
			this.element.querySelector('.switch').style.display = 'block';
		}
	}

	setValues() {
		this.username = this.element.querySelector('input[type="text"]').value;
		this.code = this.element.querySelector('.codeRoomInput').value;
	}

	hide() {
		super.hide();
	}

	toggleMenu() {
		if (this.joinGame) {
			this.joinGame = false;
			this.element.querySelector('.difficulty').style.display = '';
			this.element.querySelector('.codeRoom').style.display = 'none';
			this.element.querySelector('.toggleCreateJoinGame').innerHTML = 'Rejoindre une partie existante';
			this.element.querySelector('.submit').innerHTML = 'Creer la partie';

		} else {
			this.joinGame = true;
			this.element.querySelector('.difficulty').style.display = 'none';
			this.element.querySelector('.codeRoom').style.display = '';
			this.element.querySelector('.toggleCreateJoinGame').innerHTML = 'Creer une nouvelle partie';
			this.element.querySelector('.submit').innerHTML = 'Rejoindre cette partie';

		}
	}
}
