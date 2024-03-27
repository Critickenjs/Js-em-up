import http from 'http';
import fs from 'fs';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import { Server as IOServer } from 'socket.io';
import Entity from './entity.js';
import Player from './player.js';
import Game from './game.js';
import DataCSV from './dataCSV.js';

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
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

const io = new IOServer(httpServer, {
	allowEIO3: true,
});
const csvdata = new DataCSV();
let game = null;

// permet d'avoir une page http://localhost/status pour suivre la consommation mémoire/cpu/etc.
app.use(expressStatusMonitor({ websocket: io }));

io.on('connection', socket => {
	console.log(`New connexion from client :${socket.id}/`);
	let player = new Player(100, Entity.canvasHeight / 2);
	socket.on('submit', formData => {
		if (game == null) {
			game = new Game(io, formData.difficulty);
			game.init();
		}
		player.pseudo = formData.pseudo;
		game.players.set(socket.id, player);
		console.log(`Client ${socket.id} pseudo : ${player.pseudo}`);
	});

	socket.emit('canvas', [Entity.canvasWidth, Entity.canvasHeight]);
	socket.on('keys', keysPressed => {
		//On met à jour le joueur avec les nouvelles keys.
		if (game != null) player.update(keysPressed, game.gameData.entitySpeedMultiplier);

	});
	socket.on('restart', () => {
		if (game != null) {
			if (!game.isInGame) {
				let players = game.players;
				game.restartGame();
				game.players = players; //On redonne la liste des joueurs précédemment connectés.
				game.players.set(socket.id, player);
			}

		} else {
			game = new Game(io, 1);
			game.init();
			game.isInGame = true;
			game.players.set(socket.id, player);
		}
	});

	socket.on('getScore', () => {
		socket.emit('score', csvdata.loadFromURL('server/data/data.csv'));
	});

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
		if (game != null) {
			game.players.delete(socket.id);
			if (!game.atLeast1PlayerAlive()) {
				game.stopUpdating();
				game = null;
				console.log("PLUS PERSONNE CO : SUPRESSION DE LA GAME");
			}
		}
	});
});
