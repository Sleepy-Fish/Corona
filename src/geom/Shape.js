import U from '../utilities';
import Spacial from './Spacial';

export default class Shape extends Spacial {
  constructor () {
    super();
    this.id = U.uuid();
    this.type = 'shape';
  }

  debug (container, color) { /* overridden in subclasses */ }

  position (xOrPoint, y) {
    super.position(xOrPoint, y);
    if (this.debug) {
      this.debug.x = this.pos.x;
      this.debug.y = this.pos.y;
    }
  }

  shift (xOrVector, y) {
    super.shift(xOrVector, y);
    if (this.debug) {
      this.debug.x = this.pos.x;
      this.debug.y = this.pos.y;
    }
  }

  x (val) {
    super.x(val);
    if (this.debug) this.debug.x = val;
  }

  y (val) {
    super.y(val);
    if (this.debug) this.debug.y = val;
  }
}
