import U from '../utilities';

export default class Shape {
  constructor (position) {
    this.id = U.uuid();
    this.pos = position;
    this.awake = true;
    this.type = 'shape';
  }

  position (position) {
    if (!arguments.length) return this.pos;
    this.pos.x = position.x;
    this.pos.y = position.y;
  }

  shift (amt) {
    this.pos.x += amt.x;
    this.pos.y += amt.y;
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    this.pos.x = val;
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    this.pos.y = val;
  }
}
