import http from 'http';
import fs from 'fs';
import express from 'express';

const app = express();
const httpServer = http.createServer(app);

app.use(express.static('client'));

console.log(`start`);

const port = process.env.PORT || 8000;
httpServer.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
