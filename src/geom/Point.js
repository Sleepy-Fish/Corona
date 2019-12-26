export default class Point {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  static Zero () {
    return new Point(0, 0);
  }

  // ** --- Point Geometry Math Functions --- ** //
  distance (point) {
    const dx = point.x - this.x;
    const dy = point.y = this.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }

  // ** --- Point Utility Functions --- ** //
  toString () {
    return `Point[${this.x}, ${this.y}]`;
  }

  json () {
    return { x: this.x, y: this.y };
  }

  copy () {
    return new Point(this.x, this.y);
  }
}
