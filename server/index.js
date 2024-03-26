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
let game = new Game(io, 4);
game.init();
let pseudo = '';

// permet d'avoir une page http://localhost/status pour suivre la consommation mémoire/cpu/etc.
app.use(expressStatusMonitor({ websocket: io }));

io.on('connection', socket => {
	console.log(`New connexion from client :${socket.id}/`);
	let player = new Player(100, Entity.canvasHeight / 2);
	game.players.set(socket.id, player);
	socket.emit('initClientEnnemys', game.wavesManager.enemys.length);
	socket.on('pseudo', pseudo => {
		pseudo = pseudo;
		player.pseudo = pseudo;
		console.log(`Client ${socket.id} pseudo : ${pseudo}`);
	});

	socket.emit('canvas', [Entity.canvasWidth, Entity.canvasHeight]);
	socket.on('keys', keysPressed => {
		//On met à jour le joueur avec les nouvelles keys.
		player.update(keysPressed, game.gameData.entitySpeedMultiplier);
	});
	socket.on('difficulty', difficulty => {
		game.difficulty = difficulty;
		game.isInGame = true;
	});
	socket.on('restart', () => {
		let data = csvdata.loadFromURL('server/data/data.csv');
		socket.emit('score', data);
		let players = game.players;
		game.destroy();
		game.players = players;
		game.players.set(socket.id, player);
	});

	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
		game.players.delete(socket.id);
	});
});
