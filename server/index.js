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

const rooms = new Map();
const intervalIds = {}; // Stocke les intervalles associés à chaque salle

io.on('connection', socket => {
	socket.on('verifRoomExit', codeRoom => {
		socket.emit('roomExisted', rooms.get(codeRoom) != null);
	});

	socket.on('submit', data => {
		if (!data.joinGame) {//!rooms.has(data.roomName)
			const newGame = new Game(data.difficulty);
			const randomPin = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
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


		const player = new Player(100, Entity.canvasHeight / 2);
		player.pseudo = data.pseudo;
		game.players.set(socket.id, player);

		socket.emit('canvas', [Entity.canvasWidth, Entity.canvasHeight]);

		socket.on('keys', keysPressed => {
			player.update(keysPressed, game.gameData.entitySpeedMultiplier);
		});

		socket.on('restart', () => {
			stopUpdating(data.roomName);
			let players = game.players;
			game.restartGame();
			game.players = players;
			game.players.set(socket.id, player);


			if (intervalIds[data.roomName] == null) {
				intervalIds[data.roomName] = setGameIntervals(data.roomName, game);
			}
			io.to(data.roomName).emit("game", game.gameData);
		});

		socket.on('disconnect', () => {
			game.players.delete(socket.id);
			if (!game.atLeast1PlayerAlive()) {
				stopUpdating(data.roomName); // Arrêter les intervalles spécifiques à cette salle
				rooms.delete(data.roomName);
			}
		});
	});
});

function stopUpdating(roomName) {
	if (intervalIds[roomName]) {
		clearInterval(intervalIds[roomName].intervalId);
		clearInterval(intervalIds[roomName].intervalIdHUD);
		delete intervalIds[roomName];
	}
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
			stopUpdating(roomName); // Arrêtez les intervalles spécifiques à cette salle
			io.to(roomName).emit('gameOver', game.gameOverData);
			game.csvdata.loadFromURL('server/data/data.csv')
				.then(updatedData => {
					io.to(roomName).emit('score', updatedData); // On envoie le score mis à jour aux clients
				})
				.catch(error => {
					console.error("Erreur lors de la lecture du fichier CSV :", error);
				});
		}
	}, 1000 / 60);

	return { intervalId, intervalIdHUD }
}


