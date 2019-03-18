export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}

export function randColour(alpha: number = Math.random()): string {
  return `rgba(${getRandomInt(255)},${getRandomInt(255)},${getRandomInt(255)},${Math.random()})`
}

export class Point {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}

export class Vector {
  private dx: number;
  private dy: number;

  constructor(dx: number, dy: number) {
    this.dx = dx;
    this.dy = dy;
  }

  getDX() {
    return this.dx;
  }

  getDY() {
    return this.dy;
  }
}