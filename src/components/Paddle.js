// import C from '../constants.json';
import U from '../utilities';
// import * as PIXI from 'pixi.js';
import { Controller } from '../input';
import { Vector, Circle, Point } from '../geom';
import { CircleCollide } from '../physics';
import Ball from './Ball';
import Component from './Component.js';

const _defaults = {
  position: new Point(window.innerWidth / 2, window.innerHeight / 2),
  radius: 450,
  width: 20,
  arc: 15
};

export default class Paddle extends Component {
  constructor (container, world, {
    position = _defaults.position,
    radius = _defaults.radius,
    width = _defaults.width,
    arc = _defaults.arc
  } = _defaults) {
    super(container, world);
    this.radius = radius;
    this.width = width;
    this.arc = arc;
    this.maxRotation = 5;
    this.makeSprite();
    this.position(position);
    this.shape = new Circle(position, this.radius);
    // TODO: Remove this
    this.shape.debug(this.container, 0x00ff00);

    this.leftKeyDown = false;
    this.rightKeyDown = false;

    this.controller = new Controller({
      left: 65,
      right: 68,
      space: 32
    });
    this.controller.onPress('left', () => {
      this.leftKeyDown = true;
    });
    this.controller.onRelease('left', () => {
      this.leftKeyDown = false;
    });
    this.controller.onPress('right', () => {
      this.rightKeyDown = true;
    });
    this.controller.onRelease('right', () => {
      this.rightKeyDown = false;
    });
    this.controller.onPress('space', () => {
      if (this.ball) {
        this.world.remove(this.ball.shape, 'ball');
        this.ball.destroy();
      }
      this.ball = new Ball(this.container, this.world, {
        position: this.spawn(),
        velocity: this.centripetal()
      });
      this.world.add(this.ball.shape, 'ball');
    });

    this.well = new CircleCollide(this.world, this.shape, 'ball');
    this.well.on('enter', (actor, interactor) => { /* console.info('ENTER: ', actor, interactor); */ });
    this.well.on('leave', (actor, interactor) => { /* console.info('LEAVE: ', actor, interactor); */ });
    this.well.on('collide', (actor, interactor) => {
      const deltaAngle = actor.angle() - this.position().angle(interactor.position());
      if (Math.abs(deltaAngle) < (this.arc / 2) + 2) {
        const bounce = this.ball.velocity().times(-1).rotation(-deltaAngle);
        this.ball.velocity(bounce);
      }
    });
  }

  makeSprite () {
    super.makeSprite();
    const radStart = U.toRad(this.angle() - (this.arc / 2));
    const radEnd = U.toRad(this.angle() + (this.arc / 2));
    this.gfx.beginFill(0xf1f2f1);
    this.gfx.arc(0, 0, this.radius, radStart, radEnd);
    this.gfx.lineTo((Math.cos(radEnd) * this.radius), (Math.sin(radEnd) * this.radius));
    this.gfx.arc(0, 0, this.radius + this.width, radEnd, radStart, true);
    this.gfx.lineTo((Math.cos(radStart) * (this.radius + this.width)), (Math.sin(radStart) * (this.radius + this.width)));
    this.gfx.endFill();
  }

  spawn () {
    const radians = U.toRad(this.angle());
    return new Point(
      this.x() + (Math.cos(radians) * (this.radius - 20)),
      this.y() + (Math.sin(radians) * (this.radius - 20))
    );
  }

  centripetal () {
    return Vector.One().angle(this.ang + 180).magnitude(5);
  }

  run (delta) {
    if (this.rightKeyDown) {
      this.spin(0.1);
    } else if (this.rot > 0) {
      this.rotation(Math.max(0, this.rot - 0.2));
    }
    if (this.leftKeyDown) {
      this.spin(-0.1);
    } else if (this.rot < 0) {
      this.rotation(Math.min(0, this.rot + 0.2));
    }
    super.run(delta);
    if (this.ball) this.ball.run(delta);
    this.well.run(delta);
  }
}
