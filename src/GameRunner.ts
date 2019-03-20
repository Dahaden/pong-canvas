import { GameObject, ObjectType } from './GameObjects/types';
import Ball from './GameObjects/ball';
import Paddle from './GameObjects/Paddle';
import HumanController from './Controllers/HumanController';
import DumbAI from './Controllers/DumbAI';
import SmartAI from './Controllers/SmartAI';
import Score from './Score';
import Stats from './Stats';
import { Controller } from './Controllers/types';
import { FeatureFlagsResponse } from './types';

const SCORE_TO_REACH = 3;

export default class GameRunner {
  private objects: GameObject[] = [];
  private controllers: Controller[] = [];
  private interval: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private score: Score;
  private stats: Stats;

  private gameOver: boolean = false;

  private smartAI: boolean = false;

  constructor() {

    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    fetch('/featureflags').then(async (response) => {
      const body: FeatureFlagsResponse = await response.json();
      this.smartAI = body.flags.useSmartAI;
      this.startGame(false);
    });
  }

  startGame(consecutiveGame: boolean) {
    this.gameOver = false;
    this.interval = setInterval(this.draw.bind(this), 20);
    this.objects.push(new Ball(this, this.canvas.width/2, this.canvas.height-30));
    
    const ai = this.smartAI ? new SmartAI(this) : new DumbAI(this);
    const aiPaddle = new Paddle(this.canvas, 20, (this.canvas.height - 75)/2, ai);
    ai.setPaddle(aiPaddle);
    this.objects.push(aiPaddle);

    const humanController = new HumanController();
    this.controllers.push(humanController);
    this.controllers.push(ai);

    this.objects.push(new Paddle(this.canvas, this.canvas.width - 20, (this.canvas.height - 75)/2, humanController));

    this.score = new Score();
    this.stats = new Stats(this.score);
    if (this.smartAI) {
      this.stats.setActiveFlags(['smartAI']);
    }
    this.stats.isConsecutiveGame(consecutiveGame);
  }

  restartRound() {
    // @ts-ignore
    const ballIndex = this.objects.findIndex((o: GameObject) => o.name() === ObjectType.BALL);
    this.objects.splice(ballIndex, 1);
    this.objects.push(new Ball(this, this.canvas.width/2, this.canvas.height-30));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.gameOver) {
      this.objects.forEach(o => o.update());
      this.objects.forEach(o => o.render(this.ctx));
      this.ctx.fillStyle = 'black';
      this.ctx.font = '10px Helvetica';
      this.ctx.fillText(`AI: ${this.score.getLeft()}`, 10, 30);
      this.ctx.fillText(`Hooman: ${this.score.getRight()}`, 420, 30);
    } else {
      clearInterval(this.interval);
      this.interval = null;
      this.renderGameOver();
    }
  }

  ballHitSide(side: 'left' | 'right') {
    if (side === 'left') {
      this.score.addRight();
    } else {
      this.score.addLeft();
    }
    this.restartRound();
    if (this.score.getLeft() >= SCORE_TO_REACH || this.score.getRight() >= SCORE_TO_REACH) {
      this.gameOver = true;
      this.renderGameOver();
      this.cleanUpGame();
      // end game
    }
  }

  cleanUpGame() {
    const stats = this.stats.toJS();
    fetch('/gameresult', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stats)
    });

    this.objects = [];
    this.controllers.forEach(c => c.destroy());
    this.controllers = [];

    document.addEventListener("keypress", this.restartGameHandler.bind(this), false);
  }

  restartGameHandler(event: KeyboardEvent) {
    if (event.code === 'Space' && this.gameOver) {
      document.removeEventListener("keypress", this.restartGameHandler.bind(this), false);
      this.startGame(true);
    }
  }

  renderGameOver() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.font = '20px Helvetica';
    this.ctx.fillText(`AI: ${this.score.getLeft()}`, 10, 30);
    this.ctx.fillText(`Hooman: ${this.score.getRight()}`, 370, 30);
    if (this.score.getRight() < this.score.getLeft()) {
      this.ctx.fillText('You lose!', this.canvas.width/2 - 30, this.canvas.height/2);
    } else {
      this.ctx.fillText('You win!', this.canvas.width/2 - 30, this.canvas.height/2);
    }
    this.ctx.font = '15px Helvetica';
    this.ctx.fillText('Press space to start again.', this.canvas.width/2 - 70, this.canvas.height/2 + 30);
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getGameObjects(): GameObject[] {
    return this.objects;
  }

  getStats(): Stats {
    return this.stats;
  }
}