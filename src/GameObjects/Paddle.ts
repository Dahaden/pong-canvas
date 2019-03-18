import { GameObject } from './types';
import { Controller } from '../Controllers/types';
import { randColour, Point } from '../utils';

export default class Paddle implements GameObject {

  private controller: Controller;
  private x: number;
  private y: number;
  private canvas: HTMLCanvasElement;

  private height = 65;
  private width = 8;
  private colour = 'red';

  private speed: number = 5;

  constructor(canvas: HTMLCanvasElement, x: number, y: number, controller: Controller) {
    this.controller = controller;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
  }

  name() {
    return 'paddle';
  }

  update() {
    const dy: number = this.controller.getDelta().getDY();
    const nextPosition = this.y + this.speed * dy;
    if (nextPosition > 0 && nextPosition + this.height < this.canvas.height) {
      this.y = nextPosition;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.closePath();
  }

  collisionFrame() {
    return {
      topLeft: new Point(this.x, this.y),
      topRight: new Point(this.x + this.width, this.y),
      bottomLeft: new Point(this.x, this.y + this.height),
      bottomRight: new Point(this.x + this.width, this.y + this.height)
    };
  }
}