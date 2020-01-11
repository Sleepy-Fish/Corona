import C from '../constants.json';
import { Circle } from '../geom';
import Block from './Block.js';

const _defaults = {
  innerRadius: 150,
  outerRadius: 160,
  segments: 12,
  gutter: 1
};

export default class Ring extends Circle {
  constructor (corona, {
    innerRadius = _defaults.innerRadius,
    outerRadius = _defaults.outerRadius,
    segments = _defaults.segments,
    gutter = _defaults.gutter
  } = _defaults) {
    super(corona);
    this.blocks = [];
    // set values
    this.segments = segments;
    this.gutter = gutter;
    this.inner = new Circle(this, this.pos, innerRadius);
    this.outer = new Circle(this, this.pos, outerRadius);
  }

  position (xOrPoint, y) {
    return super.position(xOrPoint, y, () => {
      this.inner.position(xOrPoint, y);
      this.outer.position(xOrPoint, y);
      for (const block of this.blocks.filter(b => !b.destroyed)) {
        block.position(this.pos);
      }
    });
  }

  run (delta) {
    super.run(delta);
    this.innerWatcher.run(delta);
    this.outerWatcher.run(delta);
  }

  makeSprite (container) {
    super.makeSprite(container);
    if (C.DEBUG) {
      this.inner.makeDebug(this.container, 0x00ffff);
      this.outer.makeDebug(this.container, 0xff00ff);
    }

    const total = 360 - (this.gutter * this.segments);
    const step = Math.floor(total / this.segments);

    for (let s = 0; s < this.segments; s++) {
      const block = new Block(
        container,
        this.inner.radius,
        this.outer.radius,
        (s * step) + (s * this.gutter),
        (s * step) + (s * this.gutter) + step
      );
      this.blocks.push(block);
    }
    return this;
  }

  makeCollidable (world) {
    // no super

    this.world = world;
    this.layer = 'corona';
    // Inner Ring
    this.world.add(this.inner, this.layer);
    this.innerWatcher = world.watcher(this.inner, 'ball');
    this.innerWatcher.on('collide-inner', (actor, interactor) => {
      const angle = actor.position().angle(interactor.position());
      for (const block of actor.parent.blocks.filter(b => !b.destroyed)) {
        if (angle >= block.start && angle <= block.end) {
          block.destroy();
          const variance = (Math.random() * C.BALL_BOUNCE_VARIANCE * 2) - C.BALL_BOUNCE_VARIANCE;
          const bounce = interactor.velocity()
            .times(-1)
            .rotation(variance);
          interactor.velocity(bounce);
          break;
        }
      }
    });
    // Outer Ring
    this.world.add(this.outer, this.layer);
    this.outerWatcher = world.watcher(this.outer, 'ball');
    this.outerWatcher.on('collide-outer', (actor, interactor) => {
      const angle = actor.position().angle(interactor.position());
      for (const block of actor.parent.blocks.filter(b => !b.destroyed)) {
        if (angle >= block.start && angle <= block.end) {
          block.destroy();
          const variance = (Math.random() * C.BALL_BOUNCE_VARIANCE * 2) - C.BALL_BOUNCE_VARIANCE;
          const bounce = interactor.velocity()
            .times(-1)
            .rotation(variance);
          interactor.velocity(bounce);
          break;
        }
      }
    });
    return this;
  }
}
