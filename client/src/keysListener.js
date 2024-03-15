export default class KeysListener {
	constructor(element) {
		this.element = element;
		this.keysPressed = {
			MouseMode: false,
			ArrowUp: false,
			ArrowDown: false,
			ArrowLeft: false,
			ArrowRight: false,
			Space: false,
			MouseDown: false,
		};
	}

	init() {
		this.element.addEventListener('keydown', event => {
			if (this.down(event)) {
					this.keysPressed.ArrowDown = true;
				}
				if (this.up(event)) {
					this.keysPressed.ArrowUp = true;
				}
				if (this.left(event)) {
					this.keysPressed.ArrowLeft = true;
				}
				if (this.right(event)) {
					this.keysPressed.ArrowRight = true;
				}
				if (event.key == ' ') {
					this.keysPressed.Space = true;
				}
		});

		this.element.addEventListener('keyup', event => {
			if (this.down(event)) {
				this.keysPressed.ArrowDown = false;
			}
			if (this.up(event)) {
				this.keysPressed.ArrowUp = false;
			}
			if (this.left(event)) {
				this.keysPressed.ArrowLeft = false;
			}
			if (this.right(event)) {
				this.keysPressed.ArrowRight = false;
			}
			if (event.key == ' ') {
				this.keysPressed.Space = false;
			}
		});
	}

	down(event) {
		return event.key == 'ArrowDown' || event.key == 's' || event.key == 'S';
	}

	up(event) {
		return event.key == 'ArrowUp' || event.key == 'z' || event.key == 'Z';
	}

	right(event) {
		return event.key == 'ArrowRight' || event.key == 'd' || event.key == 'D';
	}

	left(event) {
		return event.key == 'ArrowLeft' || event.key == 'q' || event.key == 'Q';
	}
}
