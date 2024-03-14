import http from 'http';
import fs from 'fs';
import express from 'express';
import addWebpackMiddleware from './middlewares/addWebpackMiddleware.js';
import {Server as IOServer} from 'socket.io';

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
io.on('connection',socket => {
	console.log(`New connexion from client :${socket.id}/`);
})
