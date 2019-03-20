import { Controller } from './types';
import { Vector } from '../utils';
import GameRunner from '../GameRunner';
import { ObjectType } from '../GameObjects/types';
import Ball from '../GameObjects/Ball';
import Paddle from '../GameObjects/Paddle';
import DumbAI from './DumbAI';

function recursiveBounds(
  position: number,
  upperBound: number,
  lowerBound: number
): number {
  if (position < lowerBound) {
    return recursiveBounds(-position, upperBound, lowerBound);
  } else if (position > upperBound) {
    return recursiveBounds(2*upperBound - position, upperBound, lowerBound);
  } else {
    return position;
  }
}

export default class SmartAI extends DumbAI {
  getDelta() {
    const gameBalls = this.gameRunner
      .getGameObjects()
      .filter(o => o.name() === ObjectType.BALL) as Ball[];
    if (gameBalls.length > 0) {
      const ball = gameBalls[0];
      const ballPosition = ball.getCenter();
      const ballVector = ball.getVector();
      const paddlePosition = this.paddle.getCenter();

      // Is the ball travelling towards the paddle

      if (
        // Paddle on left, ball travelling towards paddle
        (paddlePosition.getX() - ballPosition.getX() < 0 &&
          ballVector.getDX() < 0) ||
        // Paddle on right, ball travelling towards paddle
        (paddlePosition.getX() - ballPosition.getX() > 0 &&
          ballVector.getDX() > 0)
      ) {
        const distance = paddlePosition.getX() - ballPosition.getX();
        const numRenders = distance / ballVector.getDX();

        const canvasHeight: number = this.gameRunner.getCanvas().height;
        const roughY = ballPosition.getY() + ballVector.getDY() * numRenders;

        const estimatedY = recursiveBounds(
          roughY,
          canvasHeight,
          0
        );

        if (estimatedY - 10 > paddlePosition.getY()) {
          return new Vector(0, 0.7);
        } else if (estimatedY + 10 < paddlePosition.getY()) {
          return new Vector(0, -0.7);
        }
      } else {
        return super.getDelta();
      }
    }

    return new Vector(0, 0);
  }
}
