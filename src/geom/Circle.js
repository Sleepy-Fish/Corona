import * as PIXI from 'pixi.js';
import Shape from './Shape';

export default class Circle extends Shape {
  constructor (parent, position, radius) {
    super(parent, position);
    this.radius = radius;
    this.type = 'circle';
  }

  // TODO: Remove eventually because shapes should not be reliant on PIXI
  debug (container, color = 0x00ffff) {
    this.debug = new PIXI.Sprite();
    this.gfx = new PIXI.Graphics();
    this.gfx.lineStyle(1, color);
    this.gfx.drawCircle(0, 0, this.radius);
    this.debug.addChild(this.gfx);
    this.debug.x = this.x();
    this.debug.y = this.y();
    container.addChild(this.debug);
  }
}
