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

  makeDebug (container, color = 0x00ffff) {
    this.debug = new PIXI.Sprite();
    const gfx = new PIXI.Graphics();
    gfx.lineStyle(1, color);
    gfx.drawRect(0, 0, this.height, this.width);
    this.debug.addChild(gfx);
    this.debug.x = this.x();
    this.debug.y = this.y();
    container.addChild(this.debug);
    return this;
  }
}
