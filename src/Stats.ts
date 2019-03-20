import Score from "./Score";

export default class Stats {

  paddleHitCounter: number = 0;
  consecutiveGame: boolean;
  activeFlags: string[] = [];

  score: Score;

  constructor(score: Score) {
    this.score = score;
  }

  addPaddleHit() {
    this.paddleHitCounter++;
  }

  isConsecutiveGame(consecutiveGame: boolean) {
    this.consecutiveGame = consecutiveGame;
  }

  setActiveFlags(activeFlags: string[]) {
    this.activeFlags = activeFlags;
  }

  toJS(): object {
    return {
      paddleHitCounter: this.paddleHitCounter,
      consecutiveGame: this.consecutiveGame,
      activeFlags: this.activeFlags,
      score: this.score.toJS()
    }
  }
}