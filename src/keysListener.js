const keysPressed = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowLeft: false,
	ArrowRight: false,
	Space: false,
};

window.addEventListener('keydown', event => {
	if (event.key == 'ArrowDown' || event.key == 's') {
		keysPressed.ArrowDown = true;
		console.log(keysPressed.ArrowDown);
	}
	if (event.key == 'ArrowUp' || event.key == 'z') {
		keysPressed.ArrowUp = true;
	}
	if (event.key == 'ArrowLeft' || event.key == 'q') {
		keysPressed.ArrowLeft = true;
	}
	if (event.key == 'ArrowRight' || event.key == 'd') {
		keysPressed.ArrowRight = true;
	}
	if (event.key == ' ') {
		keysPressed.Space = true;
	}
});

window.addEventListener('keyup', event => {
	if (event.key == 'ArrowDown' || event.key == 's') {
		keysPressed.ArrowDown = false;
	}
	if (event.key == 'ArrowUp' || event.key == 'z') {
		keysPressed.ArrowUp = false;
	}
	if (event.key == 'ArrowLeft' || event.key == 'q') {
		keysPressed.ArrowLeft = false;
	}
	if (event.key == 'ArrowRight' || event.key == 'd') {
		keysPressed.ArrowRight = false;
	}
	if (event.key == ' ') {
		keysPressed.Space = false;
	}
});

export default keysPressed;
