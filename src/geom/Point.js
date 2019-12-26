export default class Point {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static Zero () {
    return new Point(0, 0);
  }
}
