import View from './view.js';

export default class GameOverView extends View {
	constructor(element) {
		super(element);
		this.score = 0;
		this.kills = 0;
		this.time = 0;
	}
	show(score, kills, time) {
		super.show('flex');
		this.updateValues(score, kills, time);
	}
	hide() {
		super.hide();
	}
	setScore(score) {
		this.score = score;
		this.element.querySelector('.scoreValue').textContent = score;
	}

	setKills(kills) {
		this.kills = kills;
		this.element.querySelector('.killValue').textContent = kills;
	}

	setTime(time) {
		this.time = time;
		this.element.querySelector('.timeValue').textContent = time;
	}

	updateValues(score, kills, time) {
		this.setScore(score);
		this.setKills(kills);
		this.setTime(time);
	}
}
