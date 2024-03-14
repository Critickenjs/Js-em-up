import csvData from './csvData.js';
import View from './view.js';

export default class ScoreBoard extends View {
	constructor(element) {
		super(element);
		this.scoreListElement = this.element.querySelector('#scoreList');
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
			this.scoreListElement.innerHTML += `<li>${element[0]} : ${element[1]}</li>`;
		});
	}
}
