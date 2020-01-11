/* Spacial Class
 * Used as an abstract class to provide any other class with 2D transormation
 * It it is basically just saying whatever this thing is, it has the physical properties
 * of location, orientation, motion, etc.
 */

import U from '../utilities';
import * as PIXI from 'pixi.js';
import { Point, Vector } from '.';

export default class Spacial {
  constructor (parent = null) {
    this.id = U.uuid();
    this.pos = Point.Zero();
    this.vel = Vector.Zero();
    this.ang = 0; // Angle (Rotational equivelant to position)
    this.rot = 0; // Rotation (Rotational equivelant to velocity)
    this.maxSpeed = Infinity;
    this.maxRotation = Infinity;
    this.sprite = null; // optional visual sprite
    this.dynamic = true; // is moving about / effected by velocity
    this.awake = true; // is being checked for collsions
    this.parent = parent;
  }

  makeSprite (container) {
    this.container = container;
    this.sprite = new PIXI.Sprite();
    this.gfx = new PIXI.Graphics();
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.addChild(this.gfx);
    this.container.addChild(this.sprite);
    return this;
  }

  makeCollidable (world, layer = 'default') {
    this.world = world;
    this.layer = layer;
    this.world.add(this, this.layer);
    return this;
  }

  destroy () {
    this.run = () => {};
    if (this.sprite) this.container.removeChild(this.sprite);
    if (this.debug) this.container.removeChild(this.debug);
    if (this.world) this.world.remove(this, this.layer);
    return this;
  }

  debug (container, color) { /* overridden in subclasses */ }

  position (xOrPoint, y) {
    if (!arguments.length) return this.pos.copy();
    if (xOrPoint instanceof Object) {
      this.pos.x = xOrPoint.x;
      this.pos.y = xOrPoint.y;
    } else {
      this.pos.x = xOrPoint;
      this.pos.y = y;
    }
    if (this.sprite) {
      this.sprite.x = this.pos.x;
      this.sprite.y = this.pos.y;
    }
    if (this.debug) {
      this.debug.x = this.pos.x;
      this.debug.y = this.pos.y;
    }
    return this;
  }

  shift (xOrVector, y) {
    if (xOrVector instanceof Object) {
      this.position(this.pos.x + xOrVector.x, this.pos.y + xOrVector.y);
    } else {
      this.position(this.pos.x + xOrVector, this.pos.y + y);
    }
    return this;
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    this.position(val, this.pos.y);
    return this;
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    this.position(this.pos.x, val);
    return this;
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
    return this;
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
    return this;
  }

  vx (val) {
    if (!arguments.length) return this.vel.x;
    this.vel.x = val;
    return this;
  }

  vy (val) {
    if (!arguments.length) return this.vel.y;
    this.vel.y = val;
    return this;
  }

  angle (degree, changeVelocity) { // rotational position (current angle)
    if (!arguments.length) return U.clampAngle(this.ang);
    this.ang = U.clampAngle(degree);
    if (this.sprite) this.sprite.angle = this.ang;
    if (changeVelocity) this.vel.angle(this.ang);
    return this;
  }

  rotate (degree) { // rotational shift (rotate the spacial by some degrees)
    this.ang += degree;
    if (this.sprite) this.sprite.angle = this.ang;
    return this;
  }

  rotation (degree) { // rotational velocity (how much it rotates each tick)
    if (!arguments.length) return this.rot;
    this.rot = degree;
    return this;
  }

  spin (degree) { // rotational acceleration (applies additional rotation each tick until max)
    this.rot += degree;
    if (Math.abs(this.rot) > this.maxRotation) this.rotation(this.maxRotation * Math.sign(this.rot));
    return this;
  }

  run (delta) {
    if (this.dynamic) {
      this.shift(this.vel);
      this.rotate(this.rot);
    }
  }
}
