import { GameObject, ObjectType } from './types';
import { randColour, Point, getRandomInt, Vector } from '../utils';
import GameRunner from '../GameRunner';

function generateRandomStartVector(): Vector {
  const speed = 5;
  const x = Math.random() * 2 + 3;
  const y = Math.sqrt(speed * speed - x * x);
  const dx = Math.random() > 0.5 ? x : -x;
  const dy = Math.random() > 0.5 ? y : -y;
  return new Vector(dx, dy);
}

export default class Ball implements GameObject {

  private x: number;
  private y: number;
  private dx: number;
  private dy: number;
  private colour: string = 'blue';
  private ballRadius: number = 10;
  private gameRunner: GameRunner;

  constructor(gameRunner: GameRunner, px: number, py: number) {
    this.gameRunner = gameRunner;
    this.x = px;
    this.y = py;
    const vector = generateRandomStartVector();
    this.dx = vector.getDX();
    this.dy = vector.getDY();
  }

  name() {
    return ObjectType.BALL;
  }

  update() {
    const paddles = this.gameRunner
      .getGameObjects()
      .filter(o => o.name() === ObjectType.PADDLE);
    const canvas = this.gameRunner.getCanvas();

    // Hits top or bottom of canvas
    if (
      this.y + this.dy < this.ballRadius ||
      this.y + this.dy + this.ballRadius > canvas.height
    ) {
      this.dy = -this.dy;
      // this.colour = randColour(1);
    }

    // Hits paddles
    const ballFrame = this.collisionFrame();
    const paddlesHit = paddles
      .map(paddle => paddle.collisionFrame())
      .filter(paddleFrame => {
        if (
          paddleFrame.topRight.getX() < ballFrame.topLeft.getX() ||
          paddleFrame.topLeft.getX() > ballFrame.topRight.getX()
        ) {
          return false;
        }
        if (
          paddleFrame.topLeft.getY() > ballFrame.bottomLeft.getY() ||
          paddleFrame.bottomLeft.getY() < ballFrame.topLeft.getY()
        ) {
          return false;
        }
        return true;
      });

    if (paddlesHit.length > 0) {
      const paddleFrame = paddlesHit[0];
      // TODO attempt to reverse this logic to get corner testing?
      if (
        paddleFrame.topLeft.getY() < this.y &&
        paddleFrame.bottomLeft.getY() > this.y
      ) {
        this.dx = -this.dx;
      }
      if (
        paddleFrame.topLeft.getX() < this.x &&
        paddleFrame.topRight.getX() > this.x
      ) {
        this.dy = -this.dy;
      }
      const speedIncrease = 1.03;
      this.dx = this.dx * speedIncrease;
      this.dy = this.dy * speedIncrease;
      this.gameRunner.getStats().addPaddleHit();
    }

    // Hits ends walls
    if (this.x + this.dx + this.ballRadius > canvas.width) {
      this.gameRunner.ballHitSide('right');
    } else if (this.x + this.dx < this.ballRadius) {
      this.gameRunner.ballHitSide('left');
    }
    this.x += this.dx;
    this.y += this.dy;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.closePath();
  }

  getCenter(): Point {
    return new Point(this.x, this.y);
  }

  getVector(): Vector {
    return new Vector(this.dx, this.dy);
  }

  collisionFrame() {
    return {
      topLeft: new Point(this.x - this.ballRadius, this.y - this.ballRadius),
      topRight: new Point(this.x + this.ballRadius, this.y - this.ballRadius),
      bottomLeft: new Point(this.x - this.ballRadius, this.y + this.ballRadius),
      bottomRight: new Point(
        this.x + this.ballRadius,
        this.y + this.ballRadius
      ),
    };
  }
}
