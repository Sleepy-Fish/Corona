import C from '../constants.json';
import { Circle, Point, Vector } from '../geom';

const _defaults = {
  position: Point.Zero(),
  velocity: Vector.Zero(),
  radius: 6
};

export default class Ball extends Circle {
  constructor (container, world, {
    position = _defaults.position,
    velocity = _defaults.velocity,
    radius = _defaults.radius
  } = _defaults) {
    super();
    this.radius = radius;
    this
      .makeSprite(container)
      .makeCollidable(world)
      .position(position)
      .velocity(velocity);
    // TODO: Remove this
    if (C.DEBUG) this.makeDebug(this.container, 0xff0000);
  }

  makeSprite (container) {
    super.makeSprite(container);
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
    this.gfx.beginFill(0x418261);
    this.gfx.drawCircle(0, 0, this.radius);
    this.gfx.endFill();
    return this;
  }
}
