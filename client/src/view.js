export default class View {
	/**
	 * Balise HTML associée à la vue
	 */
	element;

	constructor(element) {
		this.element = element;
	}
	/**
	 * Affiche la vue en lui ajoutant la classe CSS `active`
	 */
	show(displayStyle = '') {
		//this.element.classList.add('active');
		this.element.style.display = displayStyle;
	}
	/**
	 * Masque la vue en enlevant la classe CSS `active`
	 */
	hide() {
		//this.element.classList.remove('active');
		this.element.style.display = 'none';
	}
}
