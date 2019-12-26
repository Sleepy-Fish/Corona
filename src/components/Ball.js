import * as PIXI from 'pixi.js';

const _defaults = {
  radius: 6
};

const makeBall = (x, y, radius) => {
  const ball = new PIXI.Sprite();
  const gfx = new PIXI.Graphics();
  gfx.beginFill(0x418261);
  gfx.drawCircle(x, y, radius);
  gfx.endFill();
  ball.addChild(gfx);
  return ball;
};

export default class Ball {
  constructor (corona, {
    radius = _defaults.radius
  } = _defaults) {
    this.corona = corona;
    this.velocity = corona.paddle.centripetal();
    this.ball = makeBall(corona.paddle.x(), corona.paddle.y(), radius);
    corona.container.addChild(this.ball);
  }

  destroy () {
    this.run = () => {};
    this.corona.container.removeChild(this.ball);
    return this;
  }

  run (delta) {
    this.ball.position.x += this.velocity.x;
    this.ball.position.y += this.velocity.y;
  }
}
