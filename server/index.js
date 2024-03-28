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

io.on('connection', socket => {
	console.log(`New connection from client: ${socket.id}`);
	socket.on('verifRoomExit', codeRoom => {
		socket.emit('roomExisted', rooms.get(codeRoom) != null);
	});
	socket.on('submit', data => {
		let intervalsId;
		if (data.joinGame) {//Le joueur veut rejoindre une partie
			//Normalement on vérifie si la room existe avant, donc pas besoin de vérifier ici, mais je le fais quand même au cas où.
			const joingame = rooms.get(data.roomName);
			if (joingame != null) {
				socket.join(data.roomName);
				joingame.addNewPlayer(socket.id, data.pseudo);
				socket.emit('roomJoined', data.roomName);
				console.log(`Joueur ${data.pseudo}(${socket.id}) à rejoint la room ${data.roomName}.`);
			} else {
				console.log(`ERROR : Joueur ${data.pseudo}(${socket.id}) essaye de rejoindre une room inexistante.`);
			}

			socket.on('restart', () => {
				socket.emit('alert', "Seul l'hôte peut relancer la game.");
			});

		} else {//Le joueur veut créer une partie
			const newGame = new Game(data.difficulty);
			let randomPin;
			do {
				randomPin = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); //10000 car math.random renvoie un double entre 0 et 1
			} while (rooms.has(randomPin));
			data.roomName = randomPin;
			rooms.set(data.roomName, newGame);
			newGame.addNewPlayer(socket.id, data.pseudo);
			newGame.init();
			socket.join(data.roomName);
			socket.emit('roomJoined', data.roomName);

			socket.on('hereKeys', keysPressed => {
				newGame.players.get(socket.id).update(keysPressed, newGame.gameData.entitySpeedMultiplier);
			});

			intervalsId = createSetIntervalsForThisGame(data.roomName, newGame);

			//Seul le créateur de la game peut la rejouer
			socket.on('restart', () => {
				let players = newGame.players;
				newGame.restartGame();
				socket.emit('game', this.gameData);
				newGame.players = players;
				intervalsId = createSetIntervalsForThisGame(data.roomName, newGame);
			});
			console.log(`Joueur ${data.pseudo}(${socket.id}) à créer la room ${data.roomName}.`);
		}
		socket.emit('canvas', [Entity.canvasWidth, Entity.canvasHeight]);

		socket.on('disconnect', () => {
			const game = rooms.get(data.roomName); // Récupérez le jeu correspondant à la salle
			console.log(`Client '${socket.id}' has deconnected from room '${data.roomName}'.`);
			game.players.delete(socket.id);
			if (!game.atLeast1PlayerAlive()) {
				stopUpdating(intervalsId.intervalId, intervalsId.intervalIdHUD);
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

function createSetIntervalsForThisGame(roomName, game) {
	const intervalIdHUD = setInterval(() => {
		game.updateHUD();
		io.to(roomName).emit('time', game.time);
		console.log(`Timer in room ${roomName} : ${game.time}`);
	}, 1000);

	const intervalId = setInterval(() => {
		if (game.isInGame) {
			io.to(roomName).emit('needPlayerKeys'); //Permet d'update les joueurs et leurs tirs
			game.update();
			io.to(roomName).emit('game', game.gameData);
		} else {
			stopUpdating(intervalId, intervalIdHUD);
			io.to(roomName).emit('gameOver', game.gameOverData);
			this.csvdata.loadFromURL('server/data/data.csv')
				.then(updatedData => {
					io.to(roomName).emit('score', updatedData); // On envoie le score mis à jour aux clients
				})
				.catch(error => {
					console.error("Erreur lors de la lecture du fichier CSV :", error);
				});
		}
	}, 1000 / 60);

	return { "intervalIdHUD": intervalIdHUD, "intervalId": intervalId };
}

