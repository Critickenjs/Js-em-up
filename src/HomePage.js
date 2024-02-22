export default class HomePage {
	constructor() {}

	show() {
		document
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : none;');
		document
			.querySelector('body')
			.setAttribute('style', 'background-image: url("/images/fond.jpg");');
		document.querySelector('.HomePage').addEventListener('submit', () => {
			this.Play();
		});
	}

	Play() {
		const username = document.querySelector('input[type="text"]').value;
		sessionStorage.setItem('username', username);
		document.querySelector('.HomePage').classList.remove('active');
		document
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : block;');
		document
			.querySelector('body')
			.setAttribute('style', 'background-image: none;');
	}
}
