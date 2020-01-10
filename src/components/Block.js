import U from '../utilities';
import * as PIXI from 'pixi.js';
import { Point } from '../geom';

export default class Block {
  constructor (container, r1, r2, start, end) {
    this.container = container;
    this.start = start;
    this.end = end;
    const radStart = U.toRad(start);
    const radEnd = U.toRad(end);
    this.gfx = new PIXI.Graphics();
    this.gfx.beginFill(0x3fafbf);
    this.gfx.arc(0, 0, r1, radStart, radEnd);
    this.gfx.lineTo((Math.cos(radEnd) * r1), (Math.sin(radEnd) * r1));
    this.gfx.arc(0, 0, r2, radEnd, radStart, true);
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
    if (!arguments.length) return new Point(this.gfx.x, this.gfx.y);
    if (xOrPoint instanceof Object) {
      this.gfx.x = xOrPoint.x;
      this.gfx.y = xOrPoint.y;
    } else {
      this.gfx.x = xOrPoint;
      this.gfx.y = y;
    }
  }

  x (val) {
    if (!arguments.length) return this.gfx.x;
    this.gfx.x = val;
  }

  y (val) {
    if (!arguments.length) return this.gfx.y;
    this.gfx.y = val;
  }
}
