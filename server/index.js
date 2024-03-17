import http from 'http';
import fs from 'fs';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import {Server as IOServer} from 'socket.io';
import Entity from './entity.js';
import Player from './player.js';
import Game from './game.js';
import WavesManager from './wavesManager.js';

const app = express();
addWebpackMiddleware(app);
const httpServer = http.createServer(app);

app.use(express.static('client'));
app.get('*', (req, res) => {
	res.send('' + fs.readFileSync('client/public/index.html'));
});

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});



const io = new IOServer(httpServer);
const game = new Game(io,1);
game.init();

io.on('connection',socket => {
	console.log(`New connexion from client :${socket.id}/`);
	let player = new Player(100,Entity.canvasHeight/2);
	game.players.set(socket.id,player);

	socket.emit('canvas',[Entity.canvasWidth,Entity.canvasHeight]);
	socket.on('keys',(keysPressed) => {

		player.update(keysPressed, game.gameData.entitySpeedMultiplier);
	})
	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
		game.players.delete(socket.id);
	})
})