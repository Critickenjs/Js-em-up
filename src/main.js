//Imports
import { Player } from './player.js';
import HomePage from './homePageView.js';
import GameOver from './gameOverView.js';
import ScoreBoard from './scoreBoard.js';
import preloadAssets from './preLoadAsset.js';
import keysPressed from './keysListener.js';
import { Entity } from './entity.js';
import { Particules } from './particules.js';
import { Power } from './power.js';
import { WavesManager } from './wavesManager.js';
import { getRandomInt } from './utils.js';
import GameView from './gameView.js';

//Canvas
const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
export default canvas;

const assets = [
	'./images/btn1.png',
	'./images/btn2.png',
	'./images/ice.png',
	'./images/shield.png',
	'./images/shield2.png',
	'./images/monster.png',
	'./images/spaceship.png',
	'./images/asteroid.png',
	'./images/bonusArrows.png',
	'./images/bonusLife.png',
	'./images/bonusShield.png',
];
const sounds = [
	'./sounds/shot.mp3',
	'./sounds/shotEnemy.mp3',
	'./sounds/dead.mp3',
];

//met à jour dynamiquement la taille du canvas
const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	console.log('canvas.width:' + canvas.width);
	console.log('canvas.height:' + canvas.height);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Chargement des assets
preloadAssets(assets, sounds, () => {
	console.log('Assets loaded');
});

//création du joueur
//Player.players.push(new Player(100, canvas.height / 2));
const player = new Player(100, window.innerHeight / 2);

//Impossible de mettre ces fonctions dans KeysListener
canvas.addEventListener('mousedown', function () {
	keysPressed.MouseDown = true;
});
canvas.addEventListener('mouseup', function () {
	keysPressed.MouseDown = false;
});

export let isInGame = false;
let time = 0;
const homePage = new HomePage(document.querySelector('.HomePage'));
const gameOver = new GameOver(document.querySelector('.gameOver'));
const gameView = new GameView(document.querySelector('.box'));
const scoreBoard = new ScoreBoard();
Particules.init();

document
	.querySelector('.scoreboardButton')
	.addEventListener('click', async () => {
		gameOver.hide();
		scoreBoard.show();
		const data = await scoreBoard.getData();
		scoreBoard.updateScore(data);
	});

const wavesManager = new WavesManager();

//Gêre l'affichage du jeu
function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	Particules.renderAll();
	player.render();
	Power.renderAll();
	wavesManager.wavesRender();
	requestAnimationFrame(render);
}

//Gêre la mise à jour des éléments du jeu.
function update() {
	if (isInGame) {
		Particules.updateAll();
		player.update(keysPressed);
		Power.updateAll(player);

		//WaveUpdate smet à jour tous ce qui est en rapport avec les ennmies, notamment les collisions, la mort du jouer, etc...
		let allDead = wavesManager.wavesUpdates(player);
		if (allDead) {
			//Si la vague est finie, on passe à la prochaine.
			wavesManager.nextWave();
			if (
				WavesManager.waveNumber %
					(WavesManager.difficultyMax + 1 - WavesManager.difficulty) ==
				0
			) {
				Power.powers.push(
					new Power(
						canvas.width,
						getRandomInt(canvas.height - Power.radius * 2) + Power.radius
					)
				);
			}
		}
		//Vérifie si le joeuur est mort et qu'il n'a plus de vie pour déclencger le GameOver.
		if (!player.alive && Player.teamLifes <= 0) {
			gameOver.show();
			document.querySelector('.gameOver #scoreValue').innerHTML = player.score;
			isInGame = false;
			return;
		}
	}
}

//Ajoute au fur et à mesure des points aux joueurs et ajoute de la vitesse au jeu
function addScorePointOverTime() {
	if (isInGame) {
		player.score += WavesManager.difficulty;
		time++;
		document.querySelector('#timeValue').innerHTML = time;
		document.querySelector('#scoreValue').innerHTML = player.score;
		//Vitesse du jeu augmente au fur et à mesure
		Entity.addToSpeed(0.001 * WavesManager.difficulty);
	}
}

setInterval(addScorePointOverTime, 1000);
setInterval(update, 1000 / 60);
requestAnimationFrame(render);

document.querySelector('#lifesValue').innerHTML = Player.teamLifes;

document.querySelector('.HomePage').addEventListener('submit', event => {
	event.preventDefault();
	isInGame = true;
	homePage.Play();
	gameView.show();
	WavesManager.difficulty = getDifficultyValue();
	wavesManager.firstWave();
	player.pseudo = homePage.username;
	Player.resetTeamLivesNumber();
});

document.querySelector('#checkmouse').addEventListener('click', () => {
	if (keysPressed.MouseMode) {
		keysPressed.MouseMode = false;
	} else {
		keysPressed.MouseMode = true;
	}
});

function getDifficultyValue() {
	let select = document.getElementById('difficulty');
	let choice = select.selectedIndex; // Récupération de l'index du <option> choisi

	return parseInt(select.options[choice].value); // Récupération du texte du <option> d'index "choice"
}

document.querySelector('#restartButton2').addEventListener('click', () => {
	scoreBoard.hide();
	restartGame();
	gameView.show();
});

document.querySelector('#restartButton').addEventListener('click', () => {
	restartGame();
	gameView.show();
});

//Permet de réinitialiser le jeu pour pouvoir recommencer une autre partie.
function restartGame() {
	gameOver.restartGame();
	player.restart();
	gameView.show();
	isInGame = true;
	wavesManager.firstWave();
	time = 0;
}
