import U from '../utilities';
import * as PIXI from 'pixi.js';
import Spacial from '../geom/Spacial';

export default class Block extends Spacial {
  constructor (container, position, r1, r2, start, end) {
    super();
    this.container = container;
    this.start = start;
    this.end = end;
    const radStart = U.toRad(start);
    const radEnd = U.toRad(end);
    this.gfx = new PIXI.Graphics();
    this.gfx.beginFill(0x3fafbf);
    this.gfx.arc(position.x, position.y, r1, radStart, radEnd);
    this.gfx.lineTo((Math.cos(radEnd) * r1), (Math.sin(radEnd) * r1));
    this.gfx.arc(position.x, position.y, r2, radEnd, radStart, true);
    this.gfx.lineTo((Math.cos(radStart) * r2), (Math.sin(radStart) * r2));
    this.gfx.endFill();
    this.container.addChild(this.gfx);
    this.destroyed = false;
  }

  destroy () {
    this.container.removeChild(this.gfx);
    this.destroyed = true;
  }

  position (xOrPoint, y) {
    if (!arguments.length) return this.pos.copy();
    super.position(xOrPoint, y);
    this.gfx.x = this.pos.x;
    this.gfx.y = this.pos.y;
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    super.x(val);
    this.gfx.x = this.pos.x;
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    super.y(val);
    this.gfx.y = this.pos.y;
  }
}
