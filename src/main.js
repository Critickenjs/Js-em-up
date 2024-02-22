import { Ennemy } from './ennemy.js';
import { Player } from './player.js';
import { Shot } from './shot.js';
import keysPressed from './keysListener.js';
import { getRandomInt } from './utils.js';
import HomePage from './HomePage.js';

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	console.log('Witdh' + canvas.width);
	console.log('height' + canvas.height);
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let player = new Player(100, canvas.height / 2);

let ennemys = [];

for (let i = 0; i < 5; i++) {
	ennemys[i] = new Ennemy(
		canvas.width + getRandomInt(canvas.width),
		getRandomInt(canvas.height - Ennemy.height)
	);
	ennemys[i].index = i;
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	player.render(context);
	for (let i = 0; i < ennemys.length; i++) {
		ennemys[i].render(context);
	}
	requestAnimationFrame(render);
}

function update() {
	player.update(canvas, keysPressed);
	for (let a = 0; a < ennemys.length; a++) {
		ennemys[a].update(canvas);
		if (ennemys[a].isCollidingWith(player)) {
			if (player.alive) player.die();
		}
		for (let s = 0; s < player.shots.length; s++) {
			if (player.shots[s].isCollidingWith(ennemys[a])) {
				//Shot.shots[s]=null;
				ennemys[a].respawn(canvas);
				player.addScorePointOnEnemyKill();
				document.querySelector('#scoreValue').innerHTML = player.score;
				console.log('Score of ' + player.pseudo + ':' + player.score);
			}
		}
	}
}

function addScorePointOverTime() {
	player.score += 1;
	document.querySelector('#scoreValue').innerHTML = player.score;
}
setInterval(addScorePointOverTime, 1500);

setInterval(player.addScorePointOverTime, 1000);
setInterval(update, 1000 / 60);
requestAnimationFrame(render);

const homePage = new HomePage();
if (homePage.username != '') {
	homePage.Play();
	player.pseudo = homePage.username;
} else {
	homePage.show();
}

player.pseudo = homePage.username;
