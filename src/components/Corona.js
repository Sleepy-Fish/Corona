import * as C from '../constants.json';
import { Circle } from '../geom';
import Ring from './Ring';

const _defaults = {
  radius: 150,
  core: 20,
  count: 10,
  gutter: 4
};

export default class Corona extends Circle {
  constructor (parent, {
    radius = _defaults.radius,
    core = _defaults.core,
    count = _defaults.count,
    gutter = _defaults.gutter
  } = _defaults) {
    super(parent, arguments[1]);
    this.rings = [];
    // set values
    this.radius = radius;
    this.core = core;
    this.count = count;
    this.gutter = gutter;

    const total = this.radius - (this.gutter * this.count) - this.core;
    const step = Math.floor(total / this.count);
    for (let l = 0; l < this.count; l++) {
      const inner = (l * step) + (l * this.gutter) + this.core + this.gutter;
      const outer = (l * step) + (l * this.gutter) + step + this.core + this.gutter;
      const ring = new Ring(this, {
        innerRadius: inner,
        outerRadius: outer
      });
      this.rings.push(ring);
    }
  }

  position (xOrPoint, y) {
    return super.position(xOrPoint, y, () => {
      for (const ring of this.rings) {
        ring.position(this.pos);
      }
    });
  }

  run (delta) {
    super.run(delta);
    for (const ring of this.rings) {
      ring.run(delta);
    }
  }

  makeSprite (container) {
    super.makeSprite(container);

    this.gfx.beginFill(0x8fcf7f);
    this.gfx.drawCircle(0, 0, this.core);
    this.gfx.endFill();
    for (const ring of this.rings) {
      ring.makeSprite(container);
      if (C.DEBUG) ring.makeDebug(container);
    }
    return this;
  }

  makeCollidable (world) {
    super.makeCollidable(world, 'corona');

    for (const ring of this.rings) {
      ring.makeCollidable(world);
    }
    return this;
  }
}
