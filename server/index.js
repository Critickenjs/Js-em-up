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
let game = null;

// permet d'avoir une page http://localhost/status pour suivre la consommation mémoire/cpu/etc.
app.use(expressStatusMonitor({ websocket: io }));

const rooms = new Map();

io.on('connection', socket => {
	console.log(`New connection from client: ${socket.id}`);
	socket.on('verifRoomExit', codeRoom => {
		socket.emit('roomExisted', rooms.get(codeRoom) != null);
	});
	socket.on('submit', data => {
		if (!data.joinGame) {//!rooms.has(data.roomName)
			const newGame = new Game(io, data.difficulty);
			const randomPin = Math.floor(Math.random() * 1000).toString().padStart(4, '0');
			data.roomName = randomPin;
			rooms.set(data.roomName, newGame, socket.id);
			newGame.init();
		}
		socket.join(data.roomName);
		console.log(`Client ${socket.id} joined room: ${data.roomName}`);
		socket.emit('roomJoined', data.roomName);

		game = rooms.get(data.roomName);

		const intervalIdHUD = setInterval(() => {
			rooms.get(data.roomName).updateHUD();
			socket.emit('time', game.time);
		}, 1000 / 10);

		const intervalId = setInterval(() => {
			if (rooms.get(data.roomName).isInGame) {
				rooms.get(data.roomName).update();
				socket.emit('game', game.gameData);
			} else {
				stopUpdating(intervalId, intervalIdHUD);
			}


		}, 1000 / 60);



		const player = new Player(100, Entity.canvasHeight / 2);
		player.pseudo = data.pseudo;
		game.players.set(socket.id, player);
		console.log(`Client ${socket.id} pseudo: ${player.pseudo}`);

		socket.emit('canvas', [Entity.canvasWidth, Entity.canvasHeight]);

		socket.on('keys', keysPressed => {
			player.update(keysPressed, game.gameData.entitySpeedMultiplier);
		});

		socket.on('restart', () => {
			if (!game.isInGame) {
				let players = game.players;
				game.restartGame();
				game.players = players;
				game.players.set(socket.id, player);
			} else {
				game = new Game(io, 1);
				game.init();
				game.isInGame = true;
				game.players.set(socket.id, player);


			}
		});
		socket.on('disconnect', () => {
			console.log(`Disconnect from client ${socket.id}`);
			game.players.delete(socket.id);
			if (!game.atLeast1PlayerAlive()) {
				stopUpdating(intervalId, intervalIdHUD);
				rooms.delete(data.roomName);
				console.log("No more players in the room: deleting the game");
			}
		});
	});
});

function stopUpdating(idIntervalUpdate, idIntervalUpdateHUD) {
	clearInterval(idIntervalUpdate);
	clearInterval(idIntervalUpdateHUD);
}

