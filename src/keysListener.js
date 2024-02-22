const keysPressed = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowLeft: false,
	ArrowRight: false,
	Space: false,
};

window.addEventListener('keydown', event => {
	if (event.key == 'ArrowDown') {
		keysPressed.ArrowDown = true;
	}
	if (event.key == 'ArrowUp') {
		keysPressed.ArrowUp = true;
	}
	if (event.key == 'ArrowLeft') {
		keysPressed.ArrowLeft = true;
	}
	if (event.key == 'ArrowRight') {
		keysPressed.ArrowRight = true;
	}
	if (event.key == ' ') {
		keysPressed.Space = true;
	}
});

window.addEventListener('keyup', event => {
	switch (event.key) {
		case 'ArrowDown':
			keysPressed.ArrowDown = false;
			break;
		case 'ArrowUp':
			keysPressed.ArrowUp = false;
			break;
		case 'ArrowLeft':
			keysPressed.ArrowLeft = false;
			break;
		case 'ArrowRight':
			keysPressed.ArrowRight = false;
			break;
		case ' ':
			keysPressed.Space = false;
			break;
	}
});

export default keysPressed;
