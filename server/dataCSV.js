import fs from 'fs';
import csv from 'csv-parser';

export default class DataCSV {
	constructor() {
		this.data = {};
	}

	loadFromURL(url) {
		fs.createReadStream(url)
			.pipe(csv())
			.on('data', row => {
				this.data[row.playerName] = row.score;
			})
			.on('end', () => {});
		return this.data;
	}

	writeCSV(data) {
		for (const playerName in data) {
			fs.appendFile(
				'server/data/data.csv',
				`${playerName},${data[playerName]}\n`,
				err => {
					if (err) {
						console.error("Erreur lors de l'écriture du fichier CSV:", err);
					}
				}
			);
		}
	}
}
