export function getRandomInt(max) {
	//Return random int between 0 included and max included
	return Math.floor(Math.random() * max);
}

//Attention ne fonctionne qu'avec des petis nombres et un min négatif
export function getRandomIntWithMin(min, max) {
	//Return random int between min included and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//Attention ne fonctionne qu'avec des nombres posititifs
export function getRandomIntWithMinPositive(min, max) {
	//Return random int between min included and max included
	return Math.floor(Math.random() * (max - min) + min);
}
