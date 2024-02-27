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
}
