import { Controller } from './types';
import { Vector } from '../utils';

export default class HumanController implements Controller {

  private up: boolean = false;
  private down: boolean = false;
  private left: boolean = false;
  private right: boolean = false;

  constructor() {
    document.addEventListener("keydown", this.keyHandler.bind(this), false);
    document.addEventListener("keyup", this.keyHandler.bind(this), false);
  }

  destroy() {
    document.removeEventListener("keydown", this.keyHandler.bind(this), false);
    document.removeEventListener("keyup", this.keyHandler.bind(this), false);
  }

  keyHandler(event: KeyboardEvent) {
    const value: boolean = event.type === 'keydown';
    switch(event.key) {
      case 'ArrowLeft':
        this.left = value;
        return;
      case 'ArrowUp':
        this.up = value;
        return;
      case 'ArrowDown':
        this.down = value;
        return;
      case 'ArrowRight':
        this.right = value;
        return;
    }
  }

  getDelta() {
    const x = (this.left ? -1 : 0) + (this.right ? 1 : 0);
    const y = (this.up ? -1 : 0) + (this.down ? 1 : 0);
    return new Vector(x, y);
  }
}