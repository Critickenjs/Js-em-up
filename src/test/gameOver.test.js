import GameOver from '../gameOver.js';

describe('GameOver', () => {
  let gameOver;

  beforeEach(() => {
    gameOver = new GameOver();
  });

  it('should show the game over screen', () => {
    gameOver.show();

    expect(gameOver.element.style.display).toBe('flex');

    expect(document.querySelector('.score').style.display).toBe('none');
    expect(document.querySelector('.waves').style.display).toBe('none');
    expect(document.querySelector('.lifes').style.display).toBe('none');
    expect(document.querySelector('.time').style.display).toBe('none');
  });

  it('should hide the game over screen', () => {
    gameOver.hide();

    expect(gameOver.element.style.display).toBe('none');
  });

  it('should restart the game', () => {
    gameOver.restartGame();

    expect(gameOver.element.style.display).toBe('none');

    expect(document.querySelector('.score').style.display).toBe('block');
    expect(document.querySelector('.waves').style.display).toBe('block');
    expect(document.querySelector('.lifes').style.display).toBe('block');
    expect(document.querySelector('.time').style.display).toBe('block');
  });
});