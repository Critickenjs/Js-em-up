import { Ennemy } from './ennemy.js';
import { Player } from './player.js';
import keysPressed from './keysListener.js';
import { getRandomInt } from './utils.js';
import HomePage from './HomePage.js';
import GameOver from './gameOver.js';
import ScoreBoard from './scoreBoard.js';
import preloadAssets from './preLoadAsset.js';

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const assets = ['../images/monster.png'];

//met à jour dynamiquement la taille du canvas
const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

//Chargement des assets
preloadAssets(assets).then(() => {
	console.log('Assets loaded');
});


//création du joueur
//Player.players.push(new Player(100, canvas.height / 2));

let player = new Player(100, canvas.height / 2);

let isInGame = false;
const gameOver = new GameOver(player);
const scoreBoard = new ScoreBoard();

document
	.querySelector('.scoreboardButton')
	.addEventListener('click', async () => {
		gameOver.hide();
		scoreBoard.show();
		const data = await scoreBoard.getData();
		scoreBoard.updateScore(data);
	});

const ennemyBuffer = 10; // Nombre max d'ennemis pouvant apparaitre à l'écran. A ajuster en fonction des lags.
let ennemys = [];
firstWave();

//Gêre l'affichage du jeu
function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	player.render(context);
	for (let i = 0; i < ennemys.length; i++) {
		ennemys[i].renderShots(context);
		if (!ennemys[i].isDead) {
			ennemys[i].render(context);
		}
	}
	requestAnimationFrame(render);
}

//Gêre la mise à jour des éléments du jeu.
function update() {
	if (isInGame) {
		player.update(canvas, keysPressed);

		//WaveUpdate smet à jour tous ce qui est en rapport avec les ennmies, notamment les collisions, la mort du jouer, etc...
		if (wavesUpdates()) {
			//Si la vague est finie, on passe à la prochaine.
			nextWave();
		}

		if (!player.alive && Player.teamLifes <= 0) {
			gameOver.show();
			document.querySelector('.gameOver #scoreValue').innerHTML = player.score;
			isInGame = false;
			return;
		}
	}
}


//Collisions du joueur contre les tirs ennemis
function collisionWithEnnemyShots(ennemy) {
	if (!player.invincible) {
		for (let s = 0; s < ennemy.shots.length; s++) {
			if (ennemy.shots[s].active) {
				if (ennemy.shots[s].isCollidingWith(player)) {
					ennemy.shots[s].active = false;
					if (player.alive) player.die();
				}
			}
		}
	}
}

//Collisions des tirs du joueurs avec les ennemis
function collisionWithPlayerShots(ennemy) {
	for (let s = 0; s < player.shots.length; s++) {
		if (player.shots[s].active) {
			if (player.shots[s].isCollidingWith(ennemy)) {
				player.shots[s].active = false;
				if(ennemy.getHurt(canvas)){
					player.addScorePointOnEnemyKill();
					document.querySelector('#scoreValue').innerHTML = player.score;
				}
			}
		}
	}
}

//Gêre le mise à jour des vagues
function wavesUpdates() {
	//Renvoie un boolean en fonction de si la vague est finie (tous les ennemis ont disparues).
	let allDead = true;
	for (let a = 0; a < ennemys.length; a++) {
		ennemys[a].updateShots();
		collisionWithEnnemyShots(ennemys[a]);
		if (!ennemys[a].isDead) {
			allDead = false;
			ennemys[a].update(canvas);
			if (player.alive && !player.invincible) {
				if (ennemys[a].isCollidingWith(player)) {
					player.die();
				}
			}
			collisionWithPlayerShots(ennemys[a]);
		}
	}
	return allDead;
}


//Déclenche la 1ère vague. Lancer cette fonction réitialise donc les ennemis.
function firstWave() {
	Ennemy.waveNumber = 1;
	Ennemy.waveMaxNumberOfEnnemys = 5;
	Ennemy.waveNumberOfEnnemysSpawned = 0;
	for (let i = 0; i < ennemyBuffer; i++) {
		ennemys[i] = new Ennemy(
			canvas.width + getRandomInt(canvas.width),
			getRandomInt(canvas.height - Ennemy.height - Ennemy.spawnOffset) +
				Ennemy.spawnOffset
		);
		ennemys[i].index = i;
		Ennemy.waveNumberOfEnnemysSpawned++;
		if (Ennemy.waveNumberOfEnnemysSpawned > Ennemy.waveMaxNumberOfEnnemys) {
			ennemys[i].die();
		}
	}
	console.log(
		'Vague n°' +
			Ennemy.waveNumber +
			' : ' +
			Ennemy.waveMaxNumberOfEnnemys +
			' ennemies.'
	);
}

//Appelle la vague suivante
function nextWave() {
	Ennemy.waveNumber++;
	Ennemy.waveNumberOfEnnemysSpawned = 0;
	console.log(
		'Vague n°' +
			Ennemy.waveNumber +
			' : ' +
			Ennemy.waveMaxNumberOfEnnemys +
			' ennemies.'
	);
	Ennemy.waveMaxNumberOfEnnemys =
		(Ennemy.waveMaxNumberOfEnnemys * Ennemy.waveMultiplier) | 0; // | 0 convertit en 'int' (permet d'éviter les chiffres à virgules).
	for (let a = 0; a < ennemys.length; a++) {
		ennemys[a].fate(canvas);
	}
}

//Ajoute des points au fur et à mesure aux joueurs
function addScorePointOverTime() {
	if (isInGame) {
		player.score += 1;
		document.querySelector('#scoreValue').innerHTML = player.score;
	}
}

setInterval(addScorePointOverTime, 1500);
setInterval(update, 1000 / 60);
requestAnimationFrame(render);

const homePage = new HomePage();

document.querySelector('.HomePage').addEventListener('submit', event => {
	event.preventDefault();
	homePage.Play();
	player.pseudo = homePage.username;
	isInGame = true;
});

document.querySelector('#restartButton2').addEventListener('click', () => {
	scoreBoard.hide();
	restartGame();
});

document.querySelector('#restartButton').addEventListener('click', () => {
	restartGame();
});

//Pemret de réinitialiser le jeu pour pouvoir recommencer une autre partie.
function restartGame() {
	gameOver.restartGame(canvas);
	isInGame = true;
	firstWave();
}
