import { Controller } from './types';
import { ObjectType } from '../GameObjects/types';
import { Vector } from '../utils';
import GameRunner from '../GameRunner';
import Paddle from '../GameObjects/Paddle';

export default class DumbAI implements Controller {

  protected gameRunner: GameRunner;
  protected paddle: Paddle;

  constructor(gameRunner: GameRunner) {
    this.gameRunner = gameRunner;
  }

  setPaddle(paddle: Paddle) {
    this.paddle = paddle;
  } 

  destroy() {}

  getDelta() {
    const gameBalls = this.gameRunner.getGameObjects().filter(o => o.name() === ObjectType.BALL);
    if (gameBalls.length > 0) {
      const closestBall = gameBalls[0];
      const ballFrame = closestBall.collisionFrame();
      const paddleFrame = this.paddle.collisionFrame();

      if (paddleFrame.bottomLeft.getY() < ballFrame.topLeft.getY()) {
        return new Vector(0, 1);
      }
      if (paddleFrame.topLeft.getY() > ballFrame.bottomLeft.getY()) {
        return new Vector(0, -1);
      }
    }
    return new Vector(0, 0);
  }
}