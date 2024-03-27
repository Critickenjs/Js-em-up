import fs from 'fs';
import csv from 'csv-parser';

export default class DataCSV {
	constructor() {
		this.data = [];
	}

	loadFromURL(url) {
		return new Promise((resolve, reject) => {
			const dataArray = [];
			fs.createReadStream(url)
				.pipe(csv())
				.on('data', row => {
					dataArray.push(row);
				})
				.on('end', () => {
					resolve(dataArray);
				})
				.on('error', error => {
					reject(error);
				});
		});
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
