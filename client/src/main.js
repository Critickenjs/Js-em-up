//Imports
import KeysListener from './keysListener.js';
import { io } from 'socket.io-client';
import Client_Entity from './client_entity.js';
import Client_Player from './client_player.js';
import preloadAssets from './preLoadAssets.js';
import { Stars } from './stars.js';
import Entity from '../../server/entity.js';
import Client_Shot from './client_shot.js';
import Client_Enemy from './client_enemy.js';
import HomePage from './homePageView.js';
import Scoreboard from './scoreboardView.js';
import GameView from './gameView.js';
import Client_Power from './client_power.js';
import GameOver from './gameOverView.js';
import { Particules } from './Particules.js';
import SoundBoard from './soundBoard.js';
import CreditView from './creditView.js';

const soundboard = new SoundBoard();

const assets = [
	'./public/res/images/btn1.png',
	'./public/res/images/btn2.png',
	'./public/res/images/ice.png',
	'./public/res/images/shield.png',
	'./public/res/images/shield2.png',
	'./public/res/images/enemy.png',
	'./public/res/images/enemy2.png',
	'./public/res/images/boss.png',
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
	'./res/sounds/power.mp3',
	'./res/music/music.mp3',
];

//Chargement des assets
preloadAssets(assets, sounds, () => {
	console.log('Assets loaded');
});

let canvasServerWidth = 1200;
let canvasServerHeight = 600;
let isingame = false;

const socket = io();

socket.on('canvas', tab => {
	canvasServerWidth = tab[0];
	canvasServerHeight = tab[1];
	Client_Entity.canvasHeight = canvasServerHeight;
	Client_Entity.canvasWidth = canvasServerWidth;
});

//Canvas
const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
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
	Client_Entity.updateCanvasSize(canvasServerWidth, canvasServerHeight);
	if (window.innerWidth > window.innerHeight) {
		keys.keysPressed.isOnLandscape = true;
	} else {
		keys.keysPressed.isOnLandscape = false;
	}

}

Stars.init();
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

const screen = window.screen;

if (
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)
) {
	// true for mobile device
	keys.keysPressed.onPhone = true;

	canvas.addEventListener('touchstart', function (e) {
		e.preventDefault();
		const touch = e.touches[0];
		const rect = canvas.getBoundingClientRect();
		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;
		keys.keysPressed.MouseX = (touch.clientX - rect.left) * scaleX | 0;
		keys.keysPressed.MouseY = (touch.clientY - rect.top) * scaleY | 0;

		if (keys.keysPressed.MouseDown) {
			keys.keysPressed.MouseDown = false;
		} else {
			keys.keysPressed.MouseDown = true;
		}
	});
	window.addEventListener('deviceorientation', event => {
		keys.keysPressed.alpha = event.alpha;
		keys.keysPressed.beta = event.beta;
		keys.keysPressed.gamma = event.gamma;
	});

} else {
	// false for not mobile device
	keys.keysPressed.onPhone = false;


	canvas.addEventListener('mousemove', function (event) {

		if (isingame) {
			const rect = canvas.getBoundingClientRect();
			const scaleX = canvas.width / rect.width;
			const scaleY = canvas.height / rect.height;

			keys.keysPressed.MouseX = (event.offsetX) * scaleX;
			keys.keysPressed.MouseY = (event.offsetY) * scaleY;
		}
	});
}

socket.on('time', newTime => {
	time = newTime;
	gameView.setTime(time);
});

const homePageView = new HomePage(
	document.querySelector('.HomePage'),
	keys.keysPressed.onPhone
);
const gameView = new GameView(document.querySelector('.game'));
const gameOverView = new GameOver(document.querySelector('.gameOver'));
const scoreboardView = new Scoreboard(document.querySelector('.scoreboard'));
const creditView = new CreditView(document.querySelector('.credit'));

if (isingame == false) {
	creditView.hide();
	gameView.hide();
	homePageView.show();
	scoreboardView.hide();
	gameOverView.hide();
}

homePageView.element.addEventListener('submit', event => {
	event.preventDefault();
	homePageView.setValues();
	if (homePageView.joinGame) {
		if (homePageView.code == null || homePageView.code == '') {
			alert("Veuillez renseigner un code !");
		} else {
			socket.emit('verifRoomExit', homePageView.code);
			socket.on('roomExisted', roomExisted => {
				if (roomExisted) {
					startingAGame();
				} else {
					alert("Ce code ne correspond à aucune partie en cours !");
				}
			})
		}

	} else {
		startingAGame();
	}
});


function startingAGame() {
	isingame = true;
	homePageView.hide();
	gameView.show();
	socket.emit('submit', { "joinGame": homePageView.joinGame, "pseudo": homePageView.username, "difficulty": getDifficultyValue(), "roomName": homePageView.code });
	soundboard.playSoundPowerUp();
	soundboard.playMusic();
}

socket.on('roomJoined', roomName => {
	gameView.setCode(roomName);
});

homePageView.element.querySelector('.toggleCreateJoinGame').addEventListener('click', () => {
	homePageView.toggleMenu();
});

document.querySelector('#checkmouse').addEventListener('click', () => {
	if (keys.keysPressed.MouseMode) {
		keys.keysPressed.MouseMode = false;
	} else {
		keys.keysPressed.MouseMode = true;
	}
});

socket.on('playSound', keySound => {
	soundboard.playSoundWithKey(keySound);
});

socket.on('game', gameData => {
	//Update players
	for (let i = 0; i < gameData.players.length; i++) {
		let player = players.get(gameData.players[i].id);
		if (player != null) {
			player.isAlive = true;
			player.posX = gameData.players[i].posX;
			player.posY = gameData.players[i].posY;
			player.pseudo = gameData.players[i].pseudo;
			player.invincible = gameData.players[i].invincible;
			player.score = gameData.players[i].score;
			player.scoreMultiplier = gameData.players[i].scoreMultiplier;
		} else {
			players.set(
				gameData.players[i].id,
				new Client_Player(
					gameData.players[i].posX,
					gameData.players[i].posY,
					gameData.players[i].pseudo,
					gameData.players[i].invincible,
					gameData.players[i].score,
					gameData.players[i].scoreMultiplierBonus,
				)
			);
		}
		ids.push(gameData.players[i].id);
	}
	removeDeconnectedPlayers();

	Client_Power.powers = [];
	for (let i = 0; i < gameData.powers.length; i++) {
		if (gameData.powers[i] != null) {
			Client_Power.powers.push(
				new Client_Power(
					gameData.powers[i].posX,
					gameData.powers[i].posY,
					gameData.powers[i].type
				)
			);
		}
	}

	//Update Shots
	Client_Shot.shots = [];
	for (let i = 0; i < gameData.shots.length; i++) {
		Client_Shot.shots.push(
			new Client_Shot(
				gameData.shots[i].posX,
				gameData.shots[i].posY,
				gameData.shots[i].isFromAPlayer,
				gameData.shots[i].perforation,
				gameData.shots[i].laser,
				gameData.shots[i].tick
			)
		);
		if (gameData.shots[i].tick == 0) {
			if (gameData.shots[i].isFromAPlayer) {
				soundboard.playSoundPlayerShooting();
			} else {
				soundboard.playSoundEnemyShooting();
			}
		}
	}

	// New Update enemys
	for (let i = 0; i < gameData.enemys.length; i++) {
		let enemy = Client_Enemy.enemys.get(gameData.enemys[i].id);

		if (enemy != null) {
			enemy.alive = true;
			enemy.posX = gameData.enemys[i].posX;
			enemy.posY = gameData.enemys[i].posY;
			enemy.type = gameData.enemys[i].type;
			enemy.oldNbLifes = enemy.lifes;
			enemy.lifes = gameData.enemys[i].lifes;
			enemy.rebuild();
		} else {
			Client_Enemy.enemys.set(
				gameData.enemys[i].id,
				new Client_Enemy(
					gameData.enemys[i].posX,
					gameData.enemys[i].posY,
					gameData.enemys[i].type,
					gameData.enemys[i].lifes
				)
			);
		}
		ids.push(gameData.enemys[i].id);
	}
	const iterator = Client_Enemy.enemys.keys();
	let key;
	for (let i = 0; i < Client_Enemy.enemys.size; i++) {
		key = iterator.next();
		if (key.value != null) {
			const enemy = Client_Enemy.enemys.get(key.value);
			if (!isKeyInKeyList(key.value, ids) && enemy.lifes > 0) {
				Particules.explosion(
					enemy.posX + enemy.width / 2,
					enemy.posY + enemy.height / 2
				);
				enemy.reset();
			}
			if (
				enemy.type == 'darkred' &&
				enemy.oldNbLifes > enemy.lifes &&
				enemy.lifes != 0
			) {
				Particules.explosion(
					enemy.posX + enemy.width / 2,
					enemy.posY + enemy.height / 2
				);
			}
		}
	}
	for (let i = 0; i < gameData.players.length; i++) {
		if (gameData.players[i].id == socket.id) {
			gameView.setScore(gameData.players[i].score);
			gameView.setScoreMultiplier(gameData.players[i].scoreMultiplier);
			break;
		}
	}
	isingame = gameData.isInGame;
	if (!isingame) {
		homePageView.hide();
		gameView.hide();
	}
	gameView.setLifes(gameData.teamLifes);
	gameView.setWaves(gameData.wavesNumber);
});

socket.on('gameOver', gameOverData => {
	soundboard.stopMusic();
	gameView.hide();
	for (let i = 0; i < gameOverData.length; i++) {
		if (gameOverData[i].id == socket.id) {
			gameOverView.show(gameOverData[i].score);
		}
	}
});

socket.on('score', data => {
	scoreboardView.update(data);
});

function removeDeconnectedPlayers() {
	const iterator = players.keys();
	let key;
	for (let i = 0; i < players.size; i++) {
		key = iterator.next();
		if (key.value != null) {
			if (!isKeyInKeyList(key.value, ids)) {
				const player = players.get(key.value);
				if (player != null && player.isAlive) {
					soundboard.playSoundPlayerDeath();
					Particules.explosion(player.posX, player.posY);
					players.delete(key.value);
				}
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

	//Render Stars Behind
	Stars.renderAll(context);

	Particules.renderAll(context);

	//Afficher tous les tirs
	for (let i = 0; i < Client_Shot.shots.length; i++) {
		Client_Shot.shots[i].render(context);
	}

	//Afficher tous les tirs
	for (let i = 0; i < Client_Power.powers.length; i++) {
		Client_Power.powers[i].render(context);
	}

	//Render players
	const iterator_ennemies = Client_Enemy.enemys.entries();
	let entry_ennemies;
	for (let i = 0; i < Client_Enemy.enemys.size; i++) {
		entry_ennemies = iterator_ennemies.next();
		if (entry_ennemies.value != null) {
			entry_ennemies.value[1].render(context);
		}
	}

	//Render players
	const iterator = players.entries();
	let entry;
	let isCurrentClientDead = true;
	for (let i = 0; i < players.size; i++) {
		entry = iterator.next();
		if (entry.value != null) {
			entry.value[1].render(context);
			if (entry.value[0] == socket.id) {
				isCurrentClientDead = false;
			}
		}
	}
	if (isCurrentClientDead) {
		Client_Player.showMessage(
			context,
			'Vous êtes mort! En attente de réapparition...',
			'28px',
			'white',
			canvas.width / 5,
			canvas.height / 2
		);
	}

	if (keys.keysPressed.onPhone) {
		Client_Player.showMessage(
			context,
			"alpha:" + keys.keysPressed.alpha,
			'16px',
			'white',
			0,
			canvas.height - 100
		);
		Client_Player.showMessage(
			context,
			"beta:" + keys.keysPressed.beta,
			'16px',
			'white',
			0,
			canvas.height - 70
		);
		Client_Player.showMessage(
			context,
			"gamma:" + keys.keysPressed.gamma,
			'16px',
			'white',
			0,
			canvas.height - 40
		);
	}



	//Looping
	requestAnimationFrame(render);
}

requestAnimationFrame(render);

setInterval(updateStars, 10);

function updateStars() {
	Stars.updateAll();
	Particules.updateAll();
}

scoreboardView.element.querySelector('#scoreboardBack').addEventListener('click', () => {
	scoreboardView.hide();
	gameOverView.show();
});

gameOverView.element.querySelector('#restartButton').addEventListener('click', () => {
	scoreboardView.hide();
	gameOverView.hide();
	restartGame();
	gameView.show();
});

gameOverView.element.querySelector('.scoreboardButton').addEventListener('click', () => {
	gameView.hide();
	gameOverView.hide();
	scoreboardView.show();
});

gameOverView.element.querySelector('.creditButton').addEventListener('click', () => {
	gameOverView.hide();
	creditView.show();
});

creditView.element.querySelector('.creditBack').addEventListener('click', () => {
	creditView.hide();
	gameOverView.show();
});



function getDifficultyValue() {
	let select = document.getElementById('difficulty');
	let choice = select.selectedIndex; // Récupération de l'index du <option> choisi

	return parseInt(select.options[choice].value); // Récupération du texte du <option> d'index "choice"
}

function restartGame() {
	isingame = false;
	socket.emit('restart');
	socket.emit('keysrestart', keys.keysPressed);
}
