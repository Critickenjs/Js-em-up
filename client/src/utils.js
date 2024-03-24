export function getRandomInt(max) {
	//Return random int between 0 included and max included
	return Math.floor(Math.random() * max);
}

//Attention elle ne marche peut etre pas ! A verifier... Il faut utiliser de préférences la fonction au dessus.
export function getRandomIntWithMin(min, max) {
	//Return random int between min included and max included
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function coinFlip() {
	if (getRandomInt(2)==0){
		return true;
	}else{
		return false;
	}
}
