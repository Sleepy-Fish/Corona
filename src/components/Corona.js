
import * as PIXI from 'pixi.js';
import { Point } from '../geom';

const _defaults = {
  position: new Point(window.innerWidth / 2, window.innerHeight / 2),
  radius: 150,
  core: 20,
  segments: 12,
  layers: 10,
  segmentGutter: 1,
  layerGutter: 4,
  material: 'default'
};

const makeBlock = (r1, r2, start, end) => {
  const sprite = new PIXI.Sprite();
  const gfx = new PIXI.Graphics();
  const radStart = (Math.PI / 180) * start;
  const radEnd = (Math.PI / 180) * end;
  gfx.beginFill(0x8fcf7f);
  gfx.arc(0, 0, r1, radStart, radEnd);
  gfx.lineTo((Math.cos(radEnd) * r1), (Math.sin(radEnd) * r1));
  gfx.arc(0, 0, r2, radEnd, radStart, true);
  gfx.lineTo((Math.cos(radStart) * r2), (Math.sin(radStart) * r2));
  gfx.endFill();
  sprite.addChild(gfx);
  return {
    sprite,
    gfx
  };
};

const makeCore = (r) => {
  const block = new PIXI.Sprite();
  const gfx = new PIXI.Graphics();
  gfx.beginFill(0x8fcf7f);
  gfx.drawCircle(0, 0, r);
  gfx.endFill();
  block.addChild(gfx);
  return block;
};

export default class Corona {
  constructor (stage, {
    position = _defaults.position,
    radius = _defaults.radius,
    core = _defaults.core,
    segments = _defaults.segments,
    segmentGutter = _defaults.segmentGutter,
    layers = _defaults.layers,
    layerGutter = _defaults.layerGutter,
    material = _defaults.material
  } = _defaults) {
    this.container = new PIXI.Container();
    this.position(position.x, position.y);
    this.container.addChild(makeCore(core - layerGutter));
    const lTotal = radius - (layerGutter * layers) - (core - layerGutter);
    const lStep = Math.floor(lTotal / layers);
    const sTotal = 360 - (segmentGutter * segments);
    const sStep = Math.floor(sTotal / segments);
    for (let l = 0; l < layers; l++) {
      const inner = (l * lStep) + (l * layerGutter) + core;
      const outer = (l * lStep) + (l * layerGutter) + lStep + core;
      for (let s = 0; s < segments; s++) {
        const block = makeBlock(
          inner,
          outer,
          (s * sStep) + (s * segmentGutter),
          (s * sStep) + (s * segmentGutter) + sStep
        );
        this.container.addChild(block.sprite);
      }
    }
    stage.addChild(this.container);
  }

  position (x, y) {
    if (!arguments.length) return this.pos;
    x = !isNaN(x) ? x : this.pos.x;
    y = !isNaN(y) ? y : this.pos.y;
    this.pos = new Point(x, y);
    this.container.x = x;
    this.container.y = y;
    return this.pos;
  }
}
