import C from '../constants.json';
import { Circle, Point, Vector } from '../geom';

const _defaults = {
  position: Point.Zero(),
  velocity: Vector.Zero(),
  radius: 6
};

export default class Ball extends Circle {
  constructor ({
    radius = _defaults.radius
  } = _defaults) {
    super();
    this.radius = radius;
  }

  makeSprite (container) {
    super.makeSprite(container);
    if (C.DEBUG) this.makeDebug(this.container, 0xff0000);
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
    this.gfx.beginFill(0x418261);
    this.gfx.drawCircle(0, 0, this.radius);
    this.gfx.endFill();
    return this;
  }
}
