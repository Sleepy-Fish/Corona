/* Component - Spacial Extension Class
 * Extends a Spacial to tack on a sprite and collidable shape
 */

import U from '../utilities';
import * as PIXI from 'pixi.js';
import Shape from '../geom/Shape';
import Spacial from '../geom/Spacial';

export default class Component extends Spacial {
  constructor (container, world) {
    super();
    this.container = container;
    this.world = world;
    this.shape = new Shape(this);
    this.dynamic = true;
  }

  makeSprite () {
    this.sprite = new PIXI.Sprite();
    this.gfx = new PIXI.Graphics();
    this.sprite.anchor.set(0.5, 0.5);
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
    super.position(xOrPoint, y);
    this.shape.position(this.pos);
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
  }

  shift (xOrVector, y) {
    super.shift(xOrVector, y);
    this.shape.position(this.pos);
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    super.x(val);
    this.shape.x(this.pos.x);
    this.sprite.position.x = this.pos.x;
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    super.y(val);
    this.shape.y(this.pos.y);
    this.sprite.position.y = this.pos.y;
  }

  angle (degree, changeVelocity) { // rotational position
    if (!arguments.length) return U.clampAngle(this.ang);
    super.angle(degree, changeVelocity);
    this.shape.angle(this.ang, changeVelocity);
    this.sprite.angle = this.ang;
  }

  rotate (degree) { // rotational shift
    if (!arguments.length) return this.rot;
    super.rotate(degree);
    this.shape.angle(this.ang);
    this.sprite.angle = this.ang;
  }

  run (delta) {
    if (this.dynamic) {
      this.shift(this.vel);
      this.rotate(this.rot);
    }
  }
}
