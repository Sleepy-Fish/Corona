import C from '../constants.json';
import { Point, Circle } from '../geom';
import { CircleCollide } from '../physics';
import Component from './Component';
import Block from './Block.js';

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

export default class Corona extends Component {
  constructor (stage, world, {
    position = _defaults.position,
    radius = _defaults.radius,
    core = _defaults.core,
    segments = _defaults.segments,
    segmentGutter = _defaults.segmentGutter,
    layers = _defaults.layers,
    layerGutter = _defaults.layerGutter,
    material = _defaults.material
  } = _defaults) {
    super(stage, world);
    this.wells = [];
    this.shapes = [];
    this.blocks = [];
    // set values
    this.radius = radius;
    this.core = core;
    this.segments = segments;
    this.segmentGutter = segmentGutter;
    this.layers = layers;
    this.layerGutter = layerGutter;
    this.material = material;
    this.makeSprite();
    this.position(position);
    this.shape = new Circle(this, position, this.radius);
  }

  position (xOrPoint, y) {
    if (!arguments.length) return this.pos.copy();
    super.position(xOrPoint, y);
    for (const shape of this.shapes) {
      shape.position(this.pos);
    }
    for (const block of this.blocks.filter(b => !b.destroyed)) {
      block.position(this.pos);
    }
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    super.x(val);
    for (const shape of this.shapes) {
      shape.x(val);
    }
    for (const block of this.blocks.filter(b => !b.destroyed)) {
      block.x(val);
    }
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    super.y(val);
    for (const shape of this.shapes) {
      shape.y(val);
    }
    for (const block of this.blocks.filter(b => !b.destroyed)) {
      block.y(val);
    }
  }

  run (delta) {
    super.run(delta);
    for (const well of this.wells) {
      well.run(delta);
    }
  }

  makeSprite () {
    super.makeSprite();
    this.gfx.beginFill(0x8fcf7f);
    this.gfx.drawCircle(0, 0, this.core);
    this.gfx.endFill();
    const lTotal = this.radius - (this.layerGutter * this.layers) - this.core;
    const lStep = Math.floor(lTotal / this.layers);
    const sTotal = 360 - (this.segmentGutter * this.segments);
    const sStep = Math.floor(sTotal / this.segments);
    for (let l = 0; l < this.layers; l++) {
      const inner = (l * lStep) + (l * this.layerGutter) + this.core + this.layerGutter;
      const outer = (l * lStep) + (l * this.layerGutter) + lStep + this.core + this.layerGutter;

      const innerShape = new Circle(this, this.position(), inner);
      innerShape.blocks = [];
      if (C.DEBUG) innerShape.debug(this.container, 0x00ffff);
      const innerCollide = new CircleCollide(this.world, innerShape, 'ball');
      innerCollide.on('collide-inner', (actor, interactor) => {
        const x = actor.position().angle(interactor.position());
        for (const block of actor.blocks.filter(b => !b.destroyed)) {
          if (x >= block.start && x <= block.end) {
            block.destroy();
            const bounce = interactor.parent.velocity().times(-1);
            interactor.parent.velocity(bounce);
            break;
          }
        }
      });
      this.shapes.push(innerShape);
      this.wells.push(innerCollide);
      const outerShape = new Circle(this, this.position(), outer);
      outerShape.blocks = [];
      if (C.DEBUG) outerShape.debug(this.container, 0xff00ff);
      const outerCollide = new CircleCollide(this.world, outerShape, 'ball');
      outerCollide.on('collide-outer', (actor, interactor) => {
        const x = actor.position().angle(interactor.position());
        for (const block of actor.blocks.filter(b => !b.destroyed)) {
          if (x >= block.start && x <= block.end) {
            block.destroy();
            const bounce = interactor.parent.velocity().times(-1);
            interactor.parent.velocity(bounce);
            break;
          }
        }
      });
      this.shapes.push(outerShape);
      this.wells.push(outerCollide);

      for (let s = 0; s < this.segments; s++) {
        const block = new Block(
          this.container,
          this.position(),
          inner,
          outer,
          (s * sStep) + (s * this.segmentGutter),
          (s * sStep) + (s * this.segmentGutter) + sStep
        );
        this.blocks.push(block);
        innerShape.blocks.push(block);
        outerShape.blocks.push(block);
      }
    }
  }
}
