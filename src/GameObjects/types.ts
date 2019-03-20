import { Point } from '../utils';

export enum ObjectType {
  PADDLE,
  BALL
}

export interface GameObject {
  name: () => ObjectType;
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