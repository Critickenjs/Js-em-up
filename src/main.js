import { Ennemy } from './ennemy.js';
import { Player } from './player.js';
import { Shot } from './shot.js';
import keysPressed from './keysListener.js';
import { getRandomInt } from './utils.js';

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

let alive = true;

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

let player = new Player(100, 0);
let ennemys = [];
for (let i = 0; i < 5; i++) {
	ennemys[i] = new Ennemy(
		canvas.width + getRandomInt(canvas.width * 2),
		getRandomInt(canvas.height - Asteroid.height)
	);
	ennemys[i].index = i;
}

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	if (alive) {
		player.render(context);
	}
	for (let i = 0; i < ennemys.length; i++) {
		ennemys[i].render(context);
	}
	Shot.renderAll(context);
	requestAnimationFrame(render);
}

function update() {
	if (alive) {
		player.update(canvas, keysPressed);
	}
	Shot.update(canvas);
	for (let a = 0; a < ennemys.length; a++) {
		ennemys[a].update(canvas);
		for (let s = 0; s < Shot.shots.length; s++) {
			if (Shot.shots[s].isCollidingWith(ennemys[a])) {
				//Shot.shots[s]=null;
				ennemys[a].respawn(canvas);
			}
		}
	}
}

setInterval(update, 1000 / 60);
requestAnimationFrame(render);
