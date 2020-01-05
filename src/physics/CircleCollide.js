import Collide from './Collide';

export default class CircleCollide extends Collide {
  // Other can be another circle or string name of a body layer in world
  constructor (world, actor, other) {
    super(world, actor, other);
    console.warn();
  }

  check (other) {
    super.check(other);
    switch (other.type) {
      case 'circle':
        this.checkCircle(other);
        break;
    }
  }

  checkCircle (other) {
    const distance = this.actor.position().distance(other.position());
    const last = this.states[other.id] || null;
    if (distance > (this.actor.radius + other.radius)) {
      // actor is outside of interactor
      this.states[other.id] = 'outside';
      if (last !== 'outside') this.emit('leave', this.actor, other);
    } else if (distance < Math.abs(this.actor.radius - other.radius)) {
      // actor is entirely inside interactor
      this.states[other.id] = 'inside';
      if (last !== 'inside') this.emit('enter', this.actor, other);
    } else {
      // actor is crossing borders with interactor
      this.states[other.id] = 'colliding';
      if (last !== 'colliding') this.emit('collide', this.actor, other);
    }
  }
}
