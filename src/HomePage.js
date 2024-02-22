export default class HomePage {
	username;
	constructor() {
		this.username = '';
	}

	show() {
		document
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : none;');

		document.querySelector('.HomePage').addEventListener('submit', () => {
			this.Play();
		});
	}

	Play() {
		this.username = document.querySelector('input[type="text"]').value;
		document.querySelector('.HomePage').classList.remove('active');
		document
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : block;');
	}
}
