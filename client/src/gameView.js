import View from './view.js';

export default class GameView extends View {
	constructor(element) {
		super(element);
	}
	show() {
		this.element.style.display = 'flex';
		this.element
			.querySelector('.score')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.waves')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.lifes')
			.setAttribute('style', 'display : block;');
		this.element
			.querySelector('.time')
			.setAttribute('style', 'display : block;');
	}
	hide() {
		this.element.style.display = 'none';
		this.element
			.querySelector('.score')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.waves')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.lifes')
			.setAttribute('style', 'display : none;');
		this.element
			.querySelector('.time')
			.setAttribute('style', 'display : none;');
	}

	

    updateHUD(newLifesValue,newWavesValue,newTimeValue,newScoreValue,newScoreMultiplierValue){
        this.updateLifes(newLifesValue);
        this.updateWaves(newWavesValue);
        this.updateTime(newTimeValue);
        this.updateScore(newScoreValue);
        this.updateScoreMultiplier(newScoreMultiplierValue);
    }

    update(newLifesValue,newWavesValue,newScoreValue,newScoreMultiplierValue){
        this.updateLifes(newLifesValue);
        this.updateWaves(newWavesValue);
        this.updateScore(newScoreValue);
        this.updateScoreMultiplier(newScoreMultiplierValue);
    }


    updateLifes(newLifesValue){
        this.element.querySelector('#lifesValue').innerHTML = newLifesValue;
    }

    updateWaves(newWavesValue){
		this.element.querySelector('#wavesValue').innerHTML = newWavesValue;
    }

    updateTime(newTimeValue){
        this.element.querySelector('#timeValue').innerHTML = newTimeValue;
    }

    updateScore(newScoreValue){
        this.element.querySelector('#scoreValue').innerHTML = newScoreValue;
    }

    updateScoreMultiplier(newScoreMultiplierValue){
        this.element.querySelector('#scoreBonusValue').innerHTML = newScoreMultiplierValue;
    }
}
