//Imports
import KeysListener from './keysListener.js';
import {io} from 'socket.io-client';
import Client_Entity from './client_entity.js';

let canvasServerWidth=1200;
let canvasServerHeight=600;

const socket = io();

socket.on('canvas',(tab) => {
	canvasServerWidth=tab[0];
	canvasServerHeight=tab[1];
})

//Canvas
const canvas = document.querySelector('.gameCanvas');
const context = canvas.getContext('2d');
export default canvas;

//met à jour dynamiquement la taille du canvas
const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	if(canvas.width<canvasServerWidth){
		canvas.width=canvasServerWidth;
	}
	if(canvas.height<canvasServerHeight){
		canvas.height=canvasServerHeight;
	}
}

const players = new Map();
let ids = [];

const keys = new KeysListener(window);
keys.init();
socket.on("playerKeys",()=>{
	ids=[];
	socket.emit("keys",keys.keysPressed);
});



socket.on("update",(updatedPlayers)=>{
	//players.push(new Client_Entity(player.posX,player.posY))
	//players[i]=new Entity(entity.posX,entity.posY);
	for(let i=0; i<updatedPlayers.length; i++){
		players.set(updatedPlayers[i].id,new Client_Entity(updatedPlayers[i].posX,updatedPlayers[i].posY));
		ids.push(updatedPlayers[i].id);
	}
	removeDeconnectedPlayers();
}
);

function removeDeconnectedPlayers(){
	const iterator = players.keys();
	let key;
	for(let i=0; i<players.size; i++){
		key = iterator.next();
		if(key.value!=null){
			if(!isKeyInKeyList(key.value,ids)){
				players.delete(key.value);
			}
		}
	}
}

function isKeyInKeyList(key,keyList){
	for(let i=0; i<keyList.length;i++){
		if(key==keyList[i]) return true;
	}
	return false;
}


//Impossible de mettre ces fonctions dans KeysListener
canvas.addEventListener('mousedown', function () {
	keys.keysPressed.MouseDown = true;
});
canvas.addEventListener('mouseup', function () {
	keys.keysPressed.MouseDown = false;
});

//Gêre l'affichage du jeu
function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	const iterator = players.entries();
	let entry;
	for(let i=0; i<players.size; i++){
		entry = iterator.next();
		if(entry.value!=null){
			entry.value[1].render(context);
		}
	}
	requestAnimationFrame(render);
}

requestAnimationFrame(render);
