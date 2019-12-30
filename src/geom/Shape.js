import U from '../utilities';
import { Point } from '.';

export default class Shape {
  constructor (position) {
    this.id = U.uuid();
    this.pos = new Point();
    this.position(position);
    this.awake = true;
    this.type = 'shape';
  }

  debug (container, color) { /* overridden in subclasses */ }

  position (xOrPoint, y) {
    if (!arguments.length) return this.pos.copy();
    if (xOrPoint instanceof Point) {
      this.pos.x = xOrPoint.x;
      this.pos.y = xOrPoint.y;
    } else {
      this.pos.x = xOrPoint;
      this.pos.y = y;
    }
    if (this.debug) {
      this.debug.x = this.pos.x;
      this.debug.y = this.pos.y;
    }
  }

  shift (xOrPoint, y) {
    if (xOrPoint instanceof Point) {
      this.pos.x += xOrPoint.x;
      this.pos.y += xOrPoint.y;
    } else {
      this.pos.x += xOrPoint;
      this.pos.y += y;
    }
    if (this.debug) {
      this.debug.x = this.pos.x;
      this.debug.y = this.pos.y;
    }
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    this.pos.x = val;
    if (this.debug) this.debug.x = val;
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    this.pos.y = val;
    if (this.debug) this.debug.y = val;
  }
}
