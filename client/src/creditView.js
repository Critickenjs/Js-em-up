import View from './view.js';

export default class CreditView extends View {
    constructor(element) {
        super(element);
    }

    hide() {
        this.element.style.display = 'none';
    }

    show() {
        this.element.style.display = 'flex';
    }

}
