import http from 'http';
import fs from 'fs';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import Entity from './entity.js';
import Player from './player.js';
import Game from './game.js';
import expressStatusMonitor from 'express-status-monitor';

const app = express();

addWebpackMiddleware(app);
const httpServer = http.createServer(app);

app.use(express.static('client'));
app.get('*', (req, res, next) => {
	if (req.originalUrl === '/status') {
		return next();
	} else {
		res.send('' + fs.readFileSync('client/public/index.html', 'utf8'));
	}
});

const port = process.env.PORT || 8000;
httpServer.listen(port, '0.0.0.0', () => {
	console.log(`Server running at http://localhost:${port}/`);
});

const io = new IOServer(httpServer, {
	allowEIO3: true,
});

// permet d'avoir une page http://localhost/status pour suivre la consommation mémoire/cpu/etc.
app.use(expressStatusMonitor({ websocket: io }));

let playerQuantity = 0;

const rooms = new Map();
const intervalIds = {}; // Stocke les intervalles associés à chaque salle

io.on('connection', socket => {
	playerQuantity++;
	socket.emit("playerQuantity", playerQuantity);
	socket.on('verifRoomExit', codeRoom => {
		socket.emit('roomExisted', rooms.get(codeRoom) != null && rooms.get(codeRoom).isInGame);
	});

	socket.on('submit', data => {
		if (!data.joinGame) {//!rooms.has(data.roomName)
			const newGame = new Game(data.difficulty);
			const randomPin = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
			data.roomName = randomPin;
			rooms.set(data.roomName, newGame);
			newGame.init();
		}
		socket.join(data.roomName);
		socket.emit('roomJoined', data.roomName);

		const game = rooms.get(data.roomName);

		if (intervalIds[data.roomName] == null) {
			intervalIds[data.roomName] = setGameIntervals(data.roomName, game);
		}


		const player = new Player(100, Entity.canvasHeight / 2, data.pseudo);
		player.skin = game.players.size % 7;
		game.players.set(socket.id, player);

		socket.emit('canvas', [Entity.canvasWidth, Entity.canvasHeight]);

		socket.on('keys', keysPressed => {
			player.update(keysPressed, game.gameData.entitySpeedMultiplier);
		});

		socket.on('restart', () => {
			if (intervalIds[data.roomName] == null) {
				game.restartGame();
				intervalIds[data.roomName] = setGameIntervals(data.roomName, game);
				game.players.set(socket.id, game.oldPlayers.get(socket.id));
				game.init();
				io.to(data.roomName).emit("game", game.gameData);
			} else {
				game.players.set(socket.id, game.oldPlayers.get(socket.id));
			}
		});

		socket.on('mainmenu', () => {
			game.players.delete(socket.id);
			game.oldPlayers.delete(socket.id);
			socket.leave(data.roomName);
		})

		socket.on('disconnect', () => {
			playerQuantity--;
			if (playerQuantity < 0) playerQuantity = 0;
			socket.emit("playerQuantity", playerQuantity);
			game.players.delete(socket.id);
			if (!game.atLeast1PlayerAlive()) {
				stopUpdating(); // Arrêter les intervalles spécifiques à cette salle
				rooms.delete(data.roomName);
			}
			socket.leave(data.roomName);
		});
	});
	socket.on('disconnect', () => {
		playerQuantity--;
		if (playerQuantity < 0) playerQuantity = 0;
		socket.emit("playerQuantity", playerQuantity);
	});
});

function stopUpdating(roomName) {
	if (intervalIds[roomName]) {
		clearInterval(intervalIds[roomName].intervalId);
		clearInterval(intervalIds[roomName].intervalIdHUD);
		delete intervalIds[roomName];
		return true;
	}
	return false;
}

function setGameIntervals(roomName, game) {
	const intervalIdHUD = setInterval(() => {
		game.updateHUD();
		io.to(roomName).emit('time', game.time);
		io.to(roomName).emit('playerKeys');
	}, 1000);

	const intervalId = setInterval(() => {
		if (game.isInGame) {
			game.update();
			io.to(roomName).emit('game', game.gameData);
			io.to(roomName).emit('playerKeys');

		} else {
			io.to(roomName).emit('gameOver', game.gameOverData);
			game.csvdata.loadFromURL('server/data/data.csv')
				.then(updatedData => {
					io.to(roomName).emit('score', updatedData); // On envoie le score mis à jour aux clients
				})
				.catch(error => {
					console.error("Erreur lors de la lecture du fichier CSV :", error);
				});
			stopUpdating(roomName);
		}
	}, 1000 / 60);

	return { intervalId, intervalIdHUD }
}


