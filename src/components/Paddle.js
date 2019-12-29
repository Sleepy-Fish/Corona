import C from '../constants.json';
import * as PIXI from 'pixi.js';
import { Controller } from '../input';
import { Vector } from '../geom';
import Ball from './Ball';

const _defaults = {
  radius: 450,
  width: 20,
  arc: 15
};

const makePaddle = (radius, width, arc) => {
  const sprite = new PIXI.Sprite();
  const gfx = new PIXI.Graphics();
  const radStart = (Math.PI / 180) * (C.PADDLE_START_ANGLE - (arc / 2));
  const radEnd = (Math.PI / 180) * (C.PADDLE_START_ANGLE + (arc / 2));
  gfx.beginFill(0xf1f2f1);
  gfx.arc(0, 0, radius, radStart, radEnd);
  gfx.lineTo((Math.cos(radEnd) * radius), (Math.sin(radEnd) * radius));
  gfx.arc(0, 0, radius + width, radEnd, radStart, true);
  gfx.lineTo((Math.cos(radStart) * (radius + width)), (Math.sin(radStart) * (radius + width)));
  gfx.endFill();
  sprite.addChild(gfx);
  return {
    sprite,
    gfx
  };
};

export default class Paddle {
  constructor (corona, world, {
    radius = _defaults.radius,
    width = _defaults.width,
    arc = _defaults.arc
  } = _defaults) {
    this.corona = corona;
    this.world = world;
    this.radius = radius;
    this.width = width;
    this.velocity = 0;
    this.acc = 0.1;
    this.dec = 0.2;
    this.speed = 5;
    this.left = false;
    this.right = false;
    this.accelerating = false;
    const paddle = makePaddle(radius, width, arc);
    this.sprite = paddle.sprite;
    this.gfx = paddle.gfx;
    corona.paddle = this;
    corona.container.addChild(this.sprite);
    this.controller = new Controller({
      left: 65,
      right: 68,
      space: 32
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
    this.controller.onPress('space', () => {
      if (this.ball) {
        this.world.remove(this.ball.bounds, 'ball');
        this.ball.destroy();
      }
      this.ball = new Ball(corona, this.world);
      this.world.add(this.ball.bounds, 'ball');
    });
  }

  // Coordinate system that gives x, y location in relation to center of corona
  // It shifts slightly toward center of corona to avoid immediate collsions

  x () {
    return Math.cos(this.sprite.rotation - (Math.PI / 2)) * (this.radius - 20);
  }

  y () {
    return Math.sin(this.sprite.rotation - (Math.PI / 2)) * (this.radius - 20);
  }

  centripetal () {
    return Vector.One().direction(this.sprite.rotation + (Math.PI / 2)).magnitude(5);
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
    this.sprite.angle += this.velocity;
    if (this.ball) this.ball.run(delta);
  }
}
