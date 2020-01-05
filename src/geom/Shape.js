/* Shape - Spacial Extension Class
 * Extends a Spacial to tack on collision
 * temporarily has a debug option of drawing but not really core to shapes.
 */

import U from '../utilities';
import Spacial from './Spacial';

export default class Shape extends Spacial {
  constructor () {
    super();
    this.id = U.uuid();
    this.type = 'shape';
    this.awake = true;
  }

  debug (container, color) { /* overridden in subclasses */ }

  position (xOrPoint, y) {
    if (!arguments.length) return this.pos.copy();
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
    if (!arguments.length) return this.pos.x;
    super.x(val);
    if (this.debug) this.debug.x = val;
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    super.y(val);
    if (this.debug) this.debug.y = val;
  }
}
