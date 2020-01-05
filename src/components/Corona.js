import C from '../constants.json';
import U from '../utilities';
import { Point, Circle } from '../geom';
import { CircleCollide } from '../physics';
import Component from './Component';

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
  }

  x (val) {
    if (!arguments.length) return this.pos.x;
    super.x(val);
    for (const shape of this.shapes) {
      shape.x(val);
    }
  }

  y (val) {
    if (!arguments.length) return this.pos.y;
    super.y(val);
    for (const shape of this.shapes) {
      shape.y(val);
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
    const makeBlock = (r1, r2, start, end) => {
      const radStart = U.toRad(start);
      const radEnd = U.toRad(end);
      this.gfx.beginFill(0x8fcf7f);
      this.gfx.arc(0, 0, r1, radStart, radEnd);
      this.gfx.lineTo((Math.cos(radEnd) * r1), (Math.sin(radEnd) * r1));
      this.gfx.arc(0, 0, r2, radEnd, radStart, true);
      this.gfx.lineTo((Math.cos(radStart) * r2), (Math.sin(radStart) * r2));
      this.gfx.endFill();
    };
    const lTotal = this.radius - (this.layerGutter * this.layers) - this.core;
    const lStep = Math.floor(lTotal / this.layers);
    const sTotal = 360 - (this.segmentGutter * this.segments);
    const sStep = Math.floor(sTotal / this.segments);
    for (let l = 0; l < this.layers; l++) {
      const inner = (l * lStep) + (l * this.layerGutter) + this.core + this.layerGutter;
      const outer = (l * lStep) + (l * this.layerGutter) + lStep + this.core + this.layerGutter;

      const innerShape = new Circle(this, this.position(), inner);
      if (C.DEBUG) innerShape.debug(this.container, 0x00ffff);
      const innerCollide = new CircleCollide(this.world, innerShape, 'ball');
      innerCollide.on('collide-inner', (actor, interactor) => {
        const bounce = interactor.parent.velocity().times(-1);
        interactor.parent.velocity(bounce);
      });
      this.shapes.push(innerShape);
      this.wells.push(innerCollide);
      const outerShape = new Circle(this, this.position(), outer);
      if (C.DEBUG) outerShape.debug(this.container, 0xff00ff);
      const outerCollide = new CircleCollide(this.world, outerShape, 'ball');
      outerCollide.on('collide-outer', (actor, interactor) => {
        const bounce = interactor.parent.velocity().times(-1);
        interactor.parent.velocity(bounce);
      });
      this.shapes.push(outerShape);
      this.wells.push(outerCollide);

      for (let s = 0; s < this.segments; s++) {
        makeBlock(
          inner,
          outer,
          (s * sStep) + (s * this.segmentGutter),
          (s * sStep) + (s * this.segmentGutter) + sStep
        );
      }
    }
  }
}
