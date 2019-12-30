import { Circle, Point, Vector } from '../geom';
import Component from './Component';

const _defaults = {
  position: Point.Zero(),
  velocity: Vector.Zero(),
  radius: 6
};

export default class Ball extends Component {
  constructor (container, world, {
    position = _defaults.position,
    velocity = _defaults.velocity,
    radius = _defaults.radius
  } = _defaults) {
    super(container, world);
    this.container = container;
    this.radius = radius;
    this.makeSprite();
    this.position(position);
    this.velocity(velocity);
    this.shape = new Circle(position, this.radius);
    // TODO: Remove this
    this.shape.debug(this.container, 0xff0000);
  }

  makeSprite () {
    super.makeSprite();
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
    this.gfx.beginFill(0x418261);
    this.gfx.drawCircle(0, 0, this.radius);
    this.gfx.endFill();
  }
}
