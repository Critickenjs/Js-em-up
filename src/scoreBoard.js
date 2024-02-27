import csvData from './csvData.js';

export default class ScoreBoard {
	constructor() {
		this.scoreListElement = document.querySelector('#scoreList');
		this.element = document.querySelector('.scoreboard');
	}

	show() {
		this.element.style.display = 'flex';
	}

	hide() {
		this.element.style.display = 'none';
	}

	async getData() {
		try {
			const csv = new csvData();
			const csvUrl = '../data/scores.csv';
			return await csv.loadFromURL(csvUrl);
		} catch (error) {
			console.error('Erreur lors de la récupération des données:', error);
			throw error;
		}
	}

	updateScore(data) {
		this.scoreListElement.innerHTML = '';
		console.log(data);
		data = Object.entries(data);
		data.sort((a, b) => b[1] - a[1]);
		data.forEach(element => {
			const li = document.createElement('li');
			li.textContent = `${element[0]}: ${element[1]}`;
			this.scoreListElement.appendChild(li);
		});
	}
}
