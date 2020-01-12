import C from '../constants.json';
import U from '../utilities';
import { Controller } from '../input';
import { Vector, Circle, Point } from '../geom';
import Ball from './Ball';

const _defaults = {
  radius: 450,
  width: 20,
  arc: 15
};

export default class Paddle extends Circle {
  constructor (parent, {
    radius = _defaults.radius,
    width = _defaults.width,
    arc = _defaults.arc
  } = _defaults) {
    super(parent, arguments[1]);
    this.radius = radius;
    this.width = width;
    this.arc = arc;

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
      this.destroyBall(this.ball);
      this.ball = this.makeBall();
    });
  }

  makeBall () {
    window.favicon(true);
    const ball = new Ball(this)
      .position(this.spawn())
      .velocity(this.centripetal())
      .makeSprite(this.container)
      .makeCollidable(this.world, 'ball');
    if (C.DEBUG) ball.makeDebug(this.container);
    return ball;
  }

  destroyBall (ball) {
    if (ball instanceof Ball) {
      window.favicon(false);
      ball.destroy();
    }
  }

  makeSprite (container) {
    super.makeSprite(container);
    const radStart = U.toRad(this.angle() - (this.arc / 2));
    const radEnd = U.toRad(this.angle() + (this.arc / 2));
    this.gfx.beginFill(0xf1f2f1);
    this.gfx.arc(0, 0, this.radius, radStart, radEnd);
    this.gfx.lineTo((Math.cos(radEnd) * this.radius), (Math.sin(radEnd) * this.radius));
    this.gfx.arc(0, 0, this.radius + this.width, radEnd, radStart, true);
    this.gfx.lineTo((Math.cos(radStart) * (this.radius + this.width)), (Math.sin(radStart) * (this.radius + this.width)));
    this.gfx.endFill();
    return this;
  }

  makeCollidable (world) {
    super.makeCollidable(world);
    this.watcher = world.watcher(this, 'ball');
    this.watcher.on('leave', (actor, interactor) => {
      if (this.ball === interactor) this.destroyBall(this.ball);
    });
    this.watcher.on('collide', (actor, interactor) => {
      const deltaAngle = actor.angle() - this.position().angle(interactor.position());
      // TODO: add angle arithmatic?
      if (
        Math.abs(deltaAngle) < (this.arc / 2) + C.PADDLE_BOUNCE_LEEWAY ||
        Math.abs(deltaAngle - 360) < (this.arc / 2) + C.PADDLE_BOUNCE_LEEWAY // handles the 359.9 to 0 clamp back
      ) {
        const bounce = interactor.velocity()
          .times(-1)
          .rotation(-deltaAngle);
        interactor.velocity(bounce);
      }
    });
    return this;
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
    this.watcher.run(delta);
  }
}
