import View from './view.js';

export default class Scoreboard extends View {
	constructor(element) {
		super(element);
	}
	show() {
		this.element.style.display = 'flex';
	}
	hide() {
		this.element.style.display = 'none';
	}
}
