import * as PIXI from 'pixi.js';
import { Point, Circle } from '../geom';

const _defaults = {
  radius: 6
};

const makeBall = (x, y, radius) => {
  const sprite = new PIXI.Sprite();
  const gfx = new PIXI.Graphics();
  gfx.beginFill(0x418261);
  gfx.drawCircle(x, y, radius);
  gfx.endFill();
  sprite.addChild(gfx);
  return {
    sprite,
    gfx
  };
};

export default class Ball {
  constructor (corona, {
    radius = _defaults.radius
  } = _defaults) {
    this.corona = corona;
    this.velocity = corona.paddle.centripetal();
    const ball = makeBall(corona.paddle.x(), corona.paddle.y(), radius);
    this.sprite = ball.sprite;
    this.gfx = ball.gfx;
    this.pos = new Point();
    this.bounds = new Circle(this.pos, radius);
    corona.container.addChild(this.sprite);
  }

  position (x, y) {
    if (!arguments.length) return new Point(this.sprite.position);
    if (x) this.sprite.position.x = x;
    if (y) this.sprite.position.y = y;
  }

  destroy () {
    this.run = () => {};
    this.corona.container.removeChild(this.ball);
    return this;
  }

  run (delta) {
    this.sprite.position.x += this.velocity.x;
    this.sprite.position.y += this.velocity.y;
    this.bounds.shift(this.velocity);
  }
}
