
export default class Score {

  left: number = 0;
  right: number = 0;

  addLeft() {
    this.left++;
  }

  addRight() {
    this.right++;
  }

  getRight() {
    return this.right;
  }

  getLeft() {
    return this.left;
  }

  toJS(): object {
    const { left, right } = this;
    return {
      left,
      right
    };
  }
}