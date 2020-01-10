import * as PIXI from 'pixi.js';
import Spacial from './Spacial';

export default class Circle extends Spacial {
  constructor (parent, position, radius) {
    super(parent, position);
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
  }
}
