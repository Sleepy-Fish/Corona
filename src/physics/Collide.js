import { EventEmitter } from 'events';

export default class Collide extends EventEmitter {
  // Other can be another circle or string name of a body layer in world
  constructor (world, actor, other) {
    super();
    this.world = world;
    this.actor = actor;
    this.interactor = other;
    this.states = {};
  }

  check (other) {
    /* Overloaded In Subclasses */
  }

  run (delta) {
    if (this.actor.awake) {
      let interactors = this.interactor; // assumes interactor was stored as array of shapes
      if (typeof this.interactor === 'string') {
        interactors = this.world.layer(this.interactor);
      } else if (!Array.isArray(this.interactor)) {
        interactors = [this.interactor];
      }
      for (const other of interactors) {
        this.check(other);
      }
    }
  }
}
