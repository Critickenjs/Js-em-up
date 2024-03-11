import { Entity } from '../entity.js';

describe('Entity', () => {
  let entity;

  beforeEach(() => {
    entity = new Entity(10, 20, 30, 40);
  });

  it('should initialize with correct properties', () => {
    expect(entity.posX).toBe(10);
    expect(entity.posY).toBe(20);
    expect(entity.speedX).toBe(0);
    expect(entity.speedY).toBe(0);
    expect(entity.width).toBe(30);
    expect(entity.height).toBe(40);
    expect(entity.collision).toEqual({
      topLeft: [10, 20],
      topRight: [40, 20],
      bottomLeft: [10, 60],
      bottomRight: [40, 60],
    });
  });

  it('should update position correctly', () => {
    entity.speedX = 2;
    entity.speedY = 3;
    Entity.speedMultiplier = 0.8;

    entity.update();

    expect(entity.posX).toBe(11.6);
    expect(entity.posY).toBe(22.4);
    expect(entity.collision).toEqual({
      topLeft: [11.6, 22.4],
      topRight: [41.6, 22.4],
      bottomLeft: [11.6, 62.4],
      bottomRight: [41.6, 62.4],
    });
  });

  it('should detect collision correctly', () => {
    const otherEntity = new Entity(20, 30, 40, 50);

    const isColliding = entity.isCollidingWith(otherEntity);

    expect(isColliding).toBe(true);
  });

  it('should detect containment correctly', () => {
    const coordinate = [15, 25];

    const isContained = entity.isThisEntityContainThis(coordinate);

    expect(isContained).toBe(true);
  });

  it('should add to speed correctly', () => {
    Entity.speedMultiplier = 0.8;

    Entity.addToSpeed(0.5);

    expect(Entity.speedMultiplier).toBe(1.3);
  });

  it('should set speed correctly', () => {
    Entity.setSpeed(1.5);

    expect(Entity.speedMultiplier).toBe(1.5);
  });
});