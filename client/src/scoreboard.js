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
	update(data) {
		this.element.querySelector('#scoreList').innerHTML = '';
		for (const playerName in data) {
			const li = document.createElement('li');
			li.textContent = `${playerName} : ${data[playerName]}`;
			this.element.querySelector('#scoreList').appendChild(li);
		}
	}
}
