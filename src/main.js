console.log('Salut, can vas ? 🫠');

let isMouseDown = false;
let isMouseMoving = false;

let x = 0;
let y = 0;
let speedX = 0;
let speedY = 0;

let shape = [];
let indexShape = 0;
let waitTime = 0;

let shapes = [];
let indexShapes = 0;

const canvas = document.querySelector('.gameCanvas'),
	context = canvas.getContext('2d');

const canvasResizeObserver = new ResizeObserver(() => resampleCanvas());
canvasResizeObserver.observe(canvas);

function resampleCanvas() {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

canvas.addEventListener('mousemove', event => {
	isMouseMoving = true;
	waitTime++;
	if (isMouseDown) {
		if (waitTime > 1) {
			waitTime = 0;
			shape[indexShape] = [event.offsetX, event.offsetY];
			indexShape++;
		}
	}
});

canvas.addEventListener('mouseup', event => {
	isMouseDown = false;
	shapes[indexShapes] = shape;
	indexShapes++;
	shape = [];
	indexShape = 0;
	context.closePath();
});

canvas.addEventListener('mousedown', event => {
	isMouseDown = true;
	context.moveTo(event.offsetX, event.offsetY);
	context.beginPath();
});

const image = new Image();
image.src = '/images/monster.png';
image.addEventListener('load', event => {
	context.drawImage(image, x, y);
});

function render() {
	context.clearRect(0, 0, canvas.width, canvas.height);

	if (isMouseDown && isMouseMoving) {
	}

	for (let i = 1; i < shapes.length; i++) {
		shape = shapes[i];
		for (let i = 1; i < shape.length; i++) {
			context.moveTo(shape[i - 1][0], shape[i - 1][1]);
			context.lineTo(shape[i][0], shape[i][1]);
			context.stroke();
		}
	}

	for (let i = 1; i < shape.length; i++) {
		context.moveTo(shape[i - 1][0], shape[i - 1][1]);
		context.lineTo(shape[i][0], shape[i][1]);
		context.stroke();
	}

	context.drawImage(image, x, y);
	requestAnimationFrame(render);
}

function update() {
	isMouseMoving = false;
	x += speedX;
	if (x > canvas.width - image.width) {
		x = canvas.width - image.width;
	} else if (x < 0) {
		x = 0;
	}
	y += speedY;
	if (y > canvas.height - image.height) {
		y = canvas.height - image.height;
	} else if (y < 0) {
		y = 0;
	}
}

setInterval(update, 1000 / 60);

requestAnimationFrame(render);
