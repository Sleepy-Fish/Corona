/* Spacial Class
 * Used as an abstract class to provide any other class with 2D transormation
 * It it is basically just saying whatever this thing is, it has the physical properties
 * of location, orientation, motion, etc.
 */

import U from '../utilities';
import { Point, Vector } from '.';

export default class Spacial {
  constructor () {
    this.pos = Point.Zero();
    this.vel = Vector.Zero();
    this.ang = 0; // Angle (Rotational equivelant to position)
    this.rot = 0; // Rotation (Rotational equivelant to velocity)
    this.maxSpeed = Infinity;
    this.maxRotation = Infinity;
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
  }

  shift (xOrVector, y) {
    if (xOrVector instanceof Object) {
      this.pos.x += xOrVector.x;
      this.pos.y += xOrVector.y;
    } else {
      this.pos.x += xOrVector;
      this.pos.y += y;
    }
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    this.pos.x = val;
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    this.pos.y = val;
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

  angle (degree, changeVelocity) { // rotational position
    if (!arguments.length) return U.clampAngle(this.ang);
    this.ang = U.clampAngle(degree);
    if (changeVelocity) {
      this.vel.angle(degree);
    }
  }

  rotate (degree) { // rotational shift
    this.ang += degree;
  }

  rotation (degree) { // rotational velocity
    if (!arguments.length) return this.rot;
    this.rot = degree;
  }

  spin (degree) { // rotational acceleration
    this.rot += degree;
    if (Math.abs(this.rot) > this.maxRotation) this.rotation(this.maxRotation * Math.sign(this.rot));
  }
}
