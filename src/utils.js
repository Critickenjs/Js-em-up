export function getRandomInt(max) {
	//Return random int between 0 included and max included
	return Math.floor(Math.random() * max);
}

export function getRandomIntWithMin(min, max) {
	//Return random int between min included and max included
	return Math.floor((Math.random() * (max-min+1))+min);
}
