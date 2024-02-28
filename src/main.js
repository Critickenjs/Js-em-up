import { Ennemy } from './ennemy.js';
import { Player } from './player.js';
import keysPressed from './keysListener.js';
import { getRandomInt } from './utils.js';
import HomePage from './HomePage.js';
import GameOver from './gameOver.js';
import ScoreBoard from './scoreBoard.js';

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let player = new Player(100, canvas.height / 2);
let game = false;
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


function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	player.render(context);
	for (let i = 0; i < ennemys.length; i++) {
		if(!ennemys[i].isDead){
			ennemys[i].render(context);
		}
	}
	requestAnimationFrame(render);
}

function update() {
	if (game) {
		player.update(canvas, keysPressed);
		let allDead=true;
		for (let a = 0; a < ennemys.length; a++) {
			if(!ennemys[a].isDead){
				allDead=false;
				ennemys[a].update(canvas);
				if (ennemys[a].isCollidingWith(player)) {
					if (player.alive) player.die();
				}
				for (let s = 0; s < player.shots.length; s++) {
					if(player.shots[s].active){
						if (player.shots[s].isCollidingWith(ennemys[a])) {
							player.shots[s].active=false;
							ennemys[a].fate(canvas);
							player.addScorePointOnEnemyKill();
							document.querySelector('#scoreValue').innerHTML = player.score;
							//!\\
							//console.log('Score of ' + player.pseudo + ':' + player.score);
						}
					}
				}
			}
		}
		if(allDead){
			nextWave();
		}
		//!\\
			//console.log(player.alive, player.lifes, player.score);
		if (!player.alive && player.lifes <= 0) {
			gameOver.show();
			document.querySelector('.gameOver #scoreValue').innerHTML =
			player.score;
			game = false;
			return;
		}
	}
}

function firstWave(){
	for (let i = 0; i < ennemyBuffer; i++) {
		ennemys[i] = new Ennemy(
			canvas.width + getRandomInt(canvas.width), 
			getRandomInt(canvas.height - Ennemy.height - Ennemy.spawnOffset)+Ennemy.spawnOffset
		);
		ennemys[i].index = i;
		Ennemy.waveNumberOfEnnemysSpawned++;
		if(Ennemy.waveNumberOfEnnemysSpawned>Ennemy.waveMaxNumberOfEnnemys){
			ennemys[i].die();
		}
	}
}

function nextWave(){
	Ennemy.waveNumber++;
	Ennemy.waveNumberOfEnnemysSpawned=0;
	console.log("Vague n°"+Ennemy.waveNumber);
	Ennemy.waveMaxNumberOfEnnemys=(Ennemy.waveMaxNumberOfEnnemys*Ennemy.waveMultiplier | 0); // | 0 convertit en 'int' (permet d'éviter les chiffres à virgules).
	for (let a = 0; a < ennemys.length; a++) {
		ennemys[a].fate(canvas);
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

document.querySelector('.HomePage').addEventListener('submit', event => {
	event.preventDefault();
	homePage.Play();
	player.pseudo = homePage.username;
	game = true;
});

document.querySelector('#restartButton2').addEventListener('click', () => {
	scoreBoard.hide();
	gameOver.restartGame();
	game = true;
});
