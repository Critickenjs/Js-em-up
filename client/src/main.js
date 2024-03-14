//Imports
import { Player } from './player.js';
import HomePage from './homePageView.js';
import GameOver from './gameOverView.js';
import ScoreBoard from './scoreBoardView.js';
import preloadAssets from './preLoadAsset.js';
import { Entity } from './entity.js';
import { Particules } from './particules.js';
import { Power } from './power.js';
import { WavesManager } from './wavesManager.js';
import { getRandomInt } from './utils.js';
import GameView from './gameView.js';
import KeysListener from './keysListener.js';
//import {io} from 'socket.io-client';

//const socket = io();

//Canvas
const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
export default canvas;

const assets = [
	'./public/res/images/btn1.png',
	'./public/res/images/btn2.png',
	'./public/res/images/ice.png',
	'./public/res/images/shield.png',
	'./public/res/images/shield2.png',
	'./public/res/images/monster.png',
	'./public/res/images/spaceship.png',
	'./public/res/images/asteroid1.png',
	'./public/res/images/asteroid2.png',
	'./public/res/images/asteroid3.png',
	'./public/res/images/asteroid4.png',
	'./public/res/images/bonusArrows.png',
	'./public/images/bonusLife.png',
	'./public/res/images/bonusShield.png',
	'./public/res/images/spaceBackground.jpg',
];
const sounds = [
	'./res/sounds/shot.mp3',
	'./res/sounds/shotEnemy.mp3',
	'./res/sounds/dead.mp3',
];

//met à jour dynamiquement la taille du canvas
const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	if(canvas.width<1200){
		canvas.width=1200;
	}
	if(canvas.height<600){
		canvas.height=600;
	}
	Entity.updateCanvasSize(canvas.width,canvas.height);
	/*console.log('canvas.width:' + canvas.width);
	console.log('canvas.height:' + canvas.height);*/
}

//Chargement des assets
preloadAssets(assets, sounds, () => {
	console.log('Assets loaded');
});

const keys = new KeysListener(window);
keys.init();

//création du joueur
//Player.players.push(new Player(100, canvas.height / 2));
const player = new Player(
	100,
	window.innerHeight / 2
);

//Impossible de mettre ces fonctions dans KeysListener
canvas.addEventListener('mousedown', function () {
	keys.keysPressed.MouseDown = true;
});
canvas.addEventListener('mouseup', function () {
	keys.keysPressed.MouseDown = false;
});

export let isInGame = false;
let time = 0;
const homePage = new HomePage(document.querySelector('.HomePage'));
const gameOver = new GameOver(document.querySelector('.gameOver'));
const gameView = new GameView(document.querySelector('.game'));
const scoreBoard = new ScoreBoard(document.querySelector('.scoreboard'));

document
	.querySelector('.scoreboardButton')
	.addEventListener('click', async () => {
		gameOver.hide();
		scoreBoard.show();
		const data = await scoreBoard.getData();
		scoreBoard.updateScore(data);
	});

const wavesManager = new WavesManager(
	canvas
);



//Gêre l'affichage du jeu
function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	Particules.renderAll(context);
	player.render(context);
	Power.renderAll(context);
	wavesManager.wavesRender(context);
	requestAnimationFrame(render);
}

//Gêre la mise à jour des éléments du jeu.
function update() {
	if (isInGame) {
		gameView.update(Player.teamLifes,WavesManager.waveNumber,player.score,player.scoreMultiplierBonus);
		Particules.updateAll();
		player.update(keys.keysPressed);
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
			gameOver.updateScore(player.score);
			gameOver.show();
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
		gameView.updateScore(player.score);
		gameView.updateTime(time);
		//Vitesse du jeu augmente au fur et à mesure
		Entity.addToSpeed(0.001 * WavesManager.difficulty);
		console.log("GameSpeed : "+Entity.speedMultiplier);
	}
}

setInterval(addScorePointOverTime, 1000);
setInterval(update, 1000 / 60);
requestAnimationFrame(render);

document.querySelector('#lifesValue').innerHTML = Player.teamLifes;

document.querySelector('.HomePage').addEventListener('submit', event => {
	event.preventDefault();
	isInGame = true;
	Particules.init();
	homePage.Play();
	gameView.show();
	WavesManager.difficulty = getDifficultyValue();
	wavesManager.firstWave(window.innerWidth, window.innerHeight);
	player.pseudo = homePage.username;
	player.resetTeamLives();
});

document.querySelector('#checkmouse').addEventListener('click', () => {
	if (keys.keysPressed.MouseMode) {
		keys.keysPressed.MouseDown = false;
	} else {
		keys.keysPressed.MouseMode = true;
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
