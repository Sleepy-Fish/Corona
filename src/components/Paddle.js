import C from '../constants.json';
import * as PIXI from 'pixi.js';
import { Controller } from '../input';

const _defaults = {
  radius: 450,
  arc: 15
};

const makePaddle = (radius, arc) => {
  const paddle = new PIXI.Sprite();
  const gfx = new PIXI.Graphics();
  const radStart = (Math.PI / 180) * (C.PADDLE_START_ANGLE - (arc / 2));
  const radEnd = (Math.PI / 180) * (C.PADDLE_START_ANGLE + (arc / 2));
  gfx.beginFill(0xf1f2f1);
  gfx.arc(0, 0, radius, radStart, radEnd);
  gfx.lineTo((Math.cos(radEnd) * radius), (Math.sin(radEnd) * radius));
  gfx.arc(0, 0, radius + 10, radEnd, radStart, true);
  gfx.lineTo((Math.cos(radStart) * (radius + 10)), (Math.sin(radStart) * (radius + 10)));
  gfx.endFill();
  paddle.addChild(gfx);
  return paddle;
};

export default class Paddle {
  constructor (corona, {
    radius = _defaults.radius,
    arc = _defaults.arc
  } = _defaults) {
    this.corona = corona;
    this.velocity = 0;
    this.acc = 0.1;
    this.dec = 0.2;
    this.speed = 5;
    this.left = false;
    this.right = false;
    this.accelerating = false;
    this.paddle = makePaddle(radius, arc);
    corona.container.addChild(this.paddle);
    this.controller = new Controller({
      left: 65,
      right: 68
    });
    this.controller.onPress('left', () => {
      this.left = true;
    });
    this.controller.onRelease('left', () => {
      this.left = false;
    });
    this.controller.onPress('right', () => {
      this.right = true;
    });
    this.controller.onRelease('right', () => {
      this.right = false;
    });
  }

  run (delta) {
    if (this.right) {
      this.velocity = Math.min(this.speed, (this.velocity + this.acc));
      this.accelerating = true;
    }
    if (this.left) {
      this.velocity = Math.max(-this.speed, (this.velocity - this.acc));
      this.accelerating = true;
    }
    if (this.velocity > 0 && !this.right) {
      this.velocity = Math.max(0, (this.velocity - this.dec));
    }
    if (this.velocity < 0 && !this.left) {
      this.velocity = Math.min(0, (this.velocity + this.dec));
    }
    this.paddle.angle += this.velocity;
  }
}
