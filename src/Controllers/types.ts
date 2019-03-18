import { Vector } from '../utils';

export interface Controller {

  getDelta(): Vector;

  destroy(): void;
}