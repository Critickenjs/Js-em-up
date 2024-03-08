import { Player } from './player.js';
import keysPressed from './keysListener.js';
import HomePage from './homePage.js';
import GameOver from './gameOver.js';
import ScoreBoard from './scoreBoard.js';
import preloadAssets from './preLoadAsset.js';
import { Entity } from './entity.js';
import { Power } from './power.js';
import { WavesManager } from './wavesManager.js';
import { getRandomInt } from './utils.js';

const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
export default canvas;

const assets = ['../images/monster.png', '../images/spaceship.png'];

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
const homePage = new HomePage();
const gameOver = new GameOver();
const scoreBoard = new ScoreBoard();

document
	.querySelector('.scoreboardButton')
	.addEventListener('click', async () => {
		gameOver.hide();
		scoreBoard.show();
		const data = await scoreBoard.getData();
		scoreBoard.updateScore(data);
	});


const wavesManager = new WavesManager();
wavesManager.firstWave();

//Gêre l'affichage du jeu
function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	player.render();
	for(let i=0 ; i<Power.powers.length ; i++){
		Power.powers[i].render();
	}
	wavesManager.wavesRender();
	requestAnimationFrame(render);
}

//Gêre la mise à jour des éléments du jeu.
function update() {
	if (isInGame) {
		player.update(keysPressed);
		for(let i=0 ; i<Power.powers.length ; i++){
			Power.powers[i].powerCollideWithPlayer(player);
            Power.powers[i].update();
        }
		//WaveUpdate smet à jour tous ce qui est en rapport avec les ennmies, notamment les collisions, la mort du jouer, etc...
		let allDead=wavesManager.wavesUpdates(player);
		if (allDead) {
			//Si la vague est finie, on passe à la prochaine.
			wavesManager.nextWave();
			if(WavesManager.waveNumber%20==0){
				Player.teamLifes++;
				console.log("Vous gagnez une vie suplémentaire !");
				document.querySelector('#lifesValue').innerHTML = Player.teamLifes;
			}
			if(WavesManager.waveNumber%5==0){
				Power.powers.push(new Power(canvas.width, getRandomInt(canvas.height-Power.radius*2)+Power.radius));
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


//Ajoute des points au fur et à mesure aux joueurs
function addScorePointOverTime() { //A renommer updateHUD
	if (isInGame) {
		player.score += 1;
		document.querySelector('#scoreValue').innerHTML = player.score;
		//Vitesse du jeu augmente au fur et à mesure
		Entity.addToSpeed(0.001);
	}
}


setInterval(addScorePointOverTime, 1500);
setInterval(update, 1000 / 60);
requestAnimationFrame(render);

document.querySelector('#lifesValue').innerHTML = Player.teamLifes;

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

//Permet de réinitialiser le jeu pour pouvoir recommencer une autre partie.
function restartGame() {
	gameOver.restartGame();
	player.restart();
	isInGame = true;
	wavesManager.firstWave();
}
