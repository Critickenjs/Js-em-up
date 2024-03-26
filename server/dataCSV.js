import fs from 'fs';
import csv from 'csv-parser';

export default class DataCSV {
	constructor() {
		this.data = [];
	}

	loadFromURL(url) {
		fs.createReadStream(url)
			.pipe(csv())
			.on('data', row => {
				this.data.push(row);
				console.log(row);
			})
			.on('end', () => { });
		return this.data;
	}

	writeCSV(data) {
		fs.appendFile('server/data/data.csv', `${Object.keys(data)[0]},${Object.values(data)[0]}\n`, err => {
			if (err) {
				console.error(err);
				return;
			}
		});
	}
}
