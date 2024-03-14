export default class csvData {
	constructor() {
		this.data = {};
	}

	async loadFromURL(url) {
		try {
			const response = await fetch(url);
			const data = await response.text();
			console.log(data);
			this.parseCSV(data);
			return this.data;
		} catch (error) {
			console.error('Erreur lors du chargement du fichier CSV:', error);
			throw error;
		}
	}

	parseCSV(csvText) {
		const lines = csvText.split('\n');
		lines.forEach(line => {
			const [playerName, score] = line.split(',');
			this.data[playerName] = parseInt(score);
		});
		console.log(this.data);
	}
}
