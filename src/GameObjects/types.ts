import { Point } from '../utils';

export interface GameObject {
  name: () => string;
  update: () => void;
  render: (ctx: CanvasRenderingContext2D) => void;
  collisionFrame: () => Rectangle
}

interface Rectangle {
  topRight: Point,
  topLeft: Point,
  bottomRight: Point,
  bottomLeft: Point
}