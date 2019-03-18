import Score from "./Score";

export default class Stats {

  paddleHitCounter: number = 0;

  score: Score;

  constructor(score: Score) {
    this.score = score;
  }

  addPaddleHit() {
    this.paddleHitCounter++;
  }

  toJS(): object {
    return {
      paddleHitCounter: this.paddleHitCounter,
      ...this.score.toJS()
    }
  }
}