import * as PIXI from 'pixi.js';
import Spacial from './Spacial';

const _defaults = {
  radius: 1
};

export default class Circle extends Spacial {
  constructor (parent, {
    radius = _defaults.radius
  } = _defaults) {
    super(parent, arguments[1]);
    this.radius = radius;
    this.type = 'circle';
  }

  // TODO: Remove eventually because shapes should not be reliant on PIXI
  makeDebug (container, color = 0x00ffff) {
    this.debug = new PIXI.Sprite();
    this.dgfx = new PIXI.Graphics();
    this.dgfx.lineStyle(1, color);
    this.dgfx.drawCircle(0, 0, this.radius);
    this.debug.addChild(this.dgfx);
    this.debug.x = this.x();
    this.debug.y = this.y();
    container.addChild(this.debug);
    return this;
  }
}
