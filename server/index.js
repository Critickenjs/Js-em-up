import http from 'http';
import fs from 'fs';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import {Server as IOServer} from 'socket.io';
import Entity from './entity.js';
import Player from './player.js';
import Game from './game.js';

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



const game = new Game();

const io = new IOServer(httpServer);
io.on('connection',socket => {
	console.log(`New connexion from client :${socket.id}/`);
	let player = new Player(100,Entity.canvasHeight/2);
	Player.players.set(socket.id,player);
	socket.emit('canvas',[Entity.canvasWidth,Entity.canvasHeight]);
	socket.on('keys',(keysPressed) => {
		player.update(keysPressed);
	})
	socket.on('disconnect', () => {
		console.log(`Déconnexion du client ${socket.id}`);
		Player.players.delete(socket.id);
	})
})


function update() {
	io.emit('playerKeys');
	//sendPlayers();
	game.updatePlayersAndPlayerShots(Player.players);
	io.emit('game',game);
}

/*
function sendPlayers(){
	const coordinates = [];
	const iterator = Player.players.entries();

	let entry;
	for(let i=0; i<Player.players.size; i++){
		entry = iterator.next();
		if(entry.value!=null){
			coordinates.push({"id":entry.value[0],"posX":entry.value[1].posX,"posY":entry.value[1].posY});
		}
	}
	io.emit('update',coordinates);
}*/

setInterval(update, 1000 / 60);
