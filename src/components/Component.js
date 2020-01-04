import * as PIXI from 'pixi.js';
import Shape from '../geom/Shape';
import Spacial from '../geom/Spacial';

export default class Component extends Spacial {
  constructor (container, world) {
    super();
    this.container = container;
    this.world = world;
    this.shape = new Shape();
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
    super.x(val);
    this.shape.x(this.pos.y);
    this.sprite.position.x = this.pos.x;
  }

  y (val) {
    super.y(val);
    this.shape.y(this.pos.y);
    this.sprite.position.y = this.pos.y;
  }

  angle (degree) { // rotational position
    super.angle(degree);
    this.shape.angle(this.ang);
    this.sprite.angle = this.ang;
  }

  rotate (degree) { // rotational shift
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
