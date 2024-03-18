//Imports
import KeysListener from './keysListener.js';
import { io } from 'socket.io-client';
import Client_Entity from './client_entity.js';
import Client_Player from './client_player.js';
import preloadAssets from './preLoadAssets.js';
import { Particules } from './Particules.js';
import Entity from '../../server/entity.js';
import Client_Shot from './client_shot.js';
import Client_Enemy from './client_enemy.js';
import HomePage from './homePageView.js';
import GameView from './gameView.js';
import Client_Power from './client_power.js';


const assets = [
	'./public/res/images/btn1.png',
	'./public/res/images/btn2.png',
	'./public/res/images/ice.png',
	'./public/res/images/shield.png',
	'./public/res/images/shield2.png',
	'./public/res/images/enemy.png',
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

//Chargement des assets
preloadAssets(assets, sounds, () => {
	console.log('Assets loaded');
});

let canvasServerWidth = 800;
let canvasServerHeight = 800;
let isingame = false;

const socket = io();

socket.on('canvas', tab => {
	canvasServerWidth = tab[0];
	canvasServerHeight = tab[1];
	Client_Entity.canvasHeight = canvasServerWidth;
	Client_Entity.canvasWidth = canvasServerHeight;
});

//Canvas
const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
;
export default canvas;


//met à jour dynamiquement la taille du canvas
const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	if (canvas.width != canvasServerWidth) {
		canvas.width = canvasServerWidth;
	}
	if (canvas.height != canvasServerHeight) {
		canvas.height = canvasServerHeight;
	}
	Client_Entity.canvasHeight = canvas.height;
	Client_Entity.canvasWidth = canvas.width;
}

Particules.init();

let time = 0;

const players = new Map();
let ids = [];

const keys = new KeysListener(window);
keys.init();
socket.on('playerKeys', () => {
	ids = [];
	socket.emit('keys', keys.keysPressed);
});

socket.on('time', newTime => {
	time = newTime;
});

document.querySelector('.HomePage').addEventListener('submit', event => {
	event.preventDefault();
	isInGame = true;
	homePage.Play();
	gameView.show();
	WavesManager.difficulty = getDifficultyValue();
	wavesManager.firstWave(window.innerWidth, window.innerHeight);
	player.pseudo = homePage.username;
	player.resetTeamLivesNumber();
});

document.querySelector('#checkmouse').addEventListener('click', () => {
	if (keys.keysPressed.MouseMode) {
		keys.keysPressed.MouseDown = false;
	} else {
		keys.keysPressed.MouseMode = true;
	}
});

socket.on('game', gameData => {
	//Update players
	for (let i = 0; i < gameData.players.length; i++) {
		players.set(
			gameData.players[i].id,
			new Client_Player(
				gameData.players[i].posX,
				gameData.players[i].posY,
				gameData.players[i].pseudo,
				gameData.players[i].invincible
			)
		);
		ids.push(gameData.players[i].id);
	}
	removeDeconnectedPlayers();

	Client_Power.powers = [];
	for (let i = 0; i < gameData.powers.length; i++) {
		Client_Power.powers.push(
			new Client_Power(
				gameData.powers[i].posX,
				gameData.powers[i].posY,
				gameData.powers[i].type
			)
		);
	}


	//Update Shots
	Client_Shot.shots = [];
	for (let i = 0; i < gameData.shots.length; i++) {
		Client_Shot.shots.push(
			new Client_Shot(
				gameData.shots[i].posX,
				gameData.shots[i].posY,
				gameData.shots[i].isFromAPlayer,
				gameData.shots[i].perforation
			)
		);
	}

	//Update enemys
	Client_Enemy.enemys = [];
	for (let i = 0; i < gameData.enemys.length; i++) {
		Client_Enemy.enemys.push(
			new Client_Enemy(
				gameData.enemys[i].posX,
				gameData.enemys[i].posY,
				gameData.enemys[i].type,
				gameData.enemys[i].lifes
			)
		);
	}
});

function removeDeconnectedPlayers() {
	const iterator = players.keys();
	let key;
	for (let i = 0; i < players.size; i++) {
		key = iterator.next();
		if (key.value != null) {
			if (!isKeyInKeyList(key.value, ids)) {
				players.delete(key.value);
			}
		}
	}
}

function isKeyInKeyList(key, keyList) {
	for (let i = 0; i < keyList.length; i++) {
		if (key == keyList[i]) return true;
	}
	return false;
}

//Impossible de mettre ces fonctions dans KeysListener
canvas.addEventListener('mousedown', function () {
	keys.keysPressed.MouseDown = true;
});
canvas.addEventListener('mouseup', function () {
	keys.keysPressed.MouseDown = false;
});

//Gêre l'affichage du jeu
function render() {
	//Reset Canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	//Render Particules Behind
	Particules.renderAll(context);

	//Afficher les ennemis
	for (let i = 0; i < Client_Enemy.enemys.length; i++) {
		Client_Enemy.enemys[i].render(context);
	}

	//Afficher tous les tirs
	for (let i = 0; i < Client_Shot.shots.length; i++) {
		Client_Shot.shots[i].render(context);
	}

	//Afficher tous les tirs
	for (let i = 0; i < Client_Power.powers.length; i++) {
		Client_Power.powers[i].render(context);
	}

	//Render players
	const iterator = players.entries();
	let entry;
	for (let i = 0; i < players.size; i++) {
		entry = iterator.next();
		if (entry.value != null) {
			entry.value[1].render(context);
		}
	}

	//Looping
	requestAnimationFrame(render);
}

requestAnimationFrame(render);

setInterval(updateParticules, 10);

function updateParticules() {
	Particules.updateAll();
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

function restartGame() {
	gameOver.restartGame();
	player.restart();
	gameView.show();
	isInGame = true;
	wavesManager.firstWave();
	time = 0;
}

