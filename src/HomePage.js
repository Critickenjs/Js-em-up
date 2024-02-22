export default class HomePage {
	constructor() {
		this.element = document.querySelector('#home-page');
	}

	show() {
		document
			.querySelector('.gameCanvas')
			.setAttribute('style', 'display : none;');
		document
			.querySelector('body')
			.setAttribute('style', 'background-image: url("/images/fond.jpg");');
		document.querySelector('.HomePage').classList.add('active');
	}
}
