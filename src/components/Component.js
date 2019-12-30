import U from '../utilities';
import * as PIXI from 'pixi.js';
import { Point, Vector } from '../geom';
import Shape from '../geom/Shape';

export default class Component {
  constructor (container, world) {
    this.container = container;
    this.world = world;
    this.shape = new Shape();
    this.pos = Point.Zero();
    this.vel = Vector.Zero();
    this.ang = 0; // Angle (Rotational equivelant to position)
    this.rot = 0; // Rotation (Rotational equivelant to velocity)
    this.maxSpeed = Infinity;
    this.maxRotation = Infinity;
    this.dynamic = true;
  }

  makeSprite () {
    this.sprite = new PIXI.Sprite();
    this.gfx = new PIXI.Graphics();
    this.sprite.addChild(this.gfx);
    this.container.addChild(this.sprite);
  }

  destroy () {
    this.run = () => {};
    this.container.removeChild(this.sprite);
    return this;
  }

  position (xOrPoint, y) {
    if (!arguments.length) return this.pos.copy();
    if (xOrPoint instanceof Object) {
      this.pos.x = xOrPoint.x;
      this.pos.y = xOrPoint.y;
    } else {
      this.pos.x = xOrPoint;
      this.pos.y = y;
    }
    this.shape.position(this.pos);
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
  }

  shift (xOrVector, y) {
    if (xOrVector instanceof Object) {
      this.pos.x += xOrVector.x;
      this.pos.y += xOrVector.y;
    } else {
      this.pos.x += xOrVector;
      this.pos.y += y;
    }
    this.shape.position(this.pos);
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    this.pos.x = val;
    this.shape.x(val);
    this.sprite.position.x = this.pos.x;
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    this.pos.y = val;
    this.shape.y(val);
    this.sprite.position.y = this.pos.y;
  }

  velocity (xOrVector, y) {
    if (!arguments.length) return this.vel.copy();
    if (xOrVector instanceof Object) {
      this.vel.x = xOrVector.x;
      this.vel.y = xOrVector.y;
    } else {
      this.vel.x = xOrVector;
      this.vel.y = y;
    }
  }

  accelerate (xOrVector, y) {
    if (xOrVector instanceof Object) {
      this.vel.x += xOrVector.x;
      this.vel.y += xOrVector.y;
    } else {
      this.vel.x += xOrVector;
      this.vel.y += y;
    }
    if (this.vel.magnitude() > this.maxSpeed) this.vel.magnitude(this.maxSpeed);
  }

  vx (val) {
    if (!arguments.length) return this.vel.x;
    this.vel.x = val;
  }

  vy (val) {
    if (!arguments.length) return this.vel.y;
    this.vel.y = val;
  }

  angle (degree) { // rotational position
    if (!arguments.length) return this.ang;
    this.ang = U.clampAngle(degree);
    this.sprite.angle = this.ang;
  }

  rotate (degree) { // rotational shift
    this.ang += degree;
    this.sprite.angle += degree;
  }

  rotation (degree) { // rotational velocity
    if (!arguments.length) return this.rot;
    this.rot = degree;
  }

  spin (degree) { // rotational acceleration
    this.rot += degree;
    if (Math.abs(this.rot) > this.maxRotation) this.rotation(this.maxRotation * Math.sign(this.rot));
  }

  run (delta) {
    if (this.dynamic) {
      this.shift(this.vel);
      this.rotate(this.rot);
    }
  }
}
