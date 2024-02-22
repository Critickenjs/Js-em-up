export default class HomePage {
	username;
	constructor() {
		this.username = '';
		this.show();
	}

	show() {
		document
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : none;');

		document.querySelector('.score').setAttribute('style', 'display : none;');

		document.querySelector('.HomePage').addEventListener('submit', () => {
			this.Play();
		});
	}

	Play() {
		this.username = document.querySelector('input[type="text"]').value;
		console.log('Pseudo:' + this.username);
		document.querySelector('.HomePage').classList.remove('active');
		document
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : block;');
	}
}