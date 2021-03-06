export default class Controller {
  constructor (bindings = {}) {
    this.active = true;
    this.bindings = bindings; // { actionName: keyCode }
    this.press = {}; // { actionName: function - callback on key pressed }
    this.release = {}; // { actionName: function - callback on key released }
    this.hold = {}; // { actionName: function - callback while key held }
    this.keysDown = {}; // { keyCode: boolean - is key currently down }

    window.addEventListener('keydown', event => {
      this.handleDown(event);
    }, false);

    window.addEventListener('touchstart', event => {
      this.handleDown(event);
    }, false);

    window.addEventListener('keyup', event => {
      this.handleUp(event);
    }, false);

    window.addEventListener('touchend', event => {
      this.handleUp(event);
    }, false);
  }

  handleDown (event) {
    if (!this.active) return;
    switch (event.constructor.name) {
      case 'KeyboardEvent':
        for (const action in this.bindings) {
          const keyCode = this.bindings[action];
          if (keyCode === event.keyCode && !this.keysDown[keyCode]) {
            this.keysDown[keyCode] = true;
            if (typeof this.press[action] === 'function') this.press[action]();
            break;
          }
        }
        break;
    }
  }

  handleUp (event) {
    if (!this.active) return;
    switch (event.constructor.name) {
      case 'KeyboardEvent':
        for (const action in this.bindings) {
          const keyCode = this.bindings[action];
          if (keyCode === event.keyCode && this.keysDown[keyCode]) {
            this.keysDown[keyCode] = false;
            if (typeof this.release[action] === 'function') this.release[action]();
            break;
          }
        }
        break;
    }
  }

  run (delta) {
    if (!this.active) return;
    for (const action in this.bindings) {
      const keyCode = this.bindings[action];
      if (this.keysDown[keyCode]) {
        if (typeof this.hold[action] === 'function') this.hold[action]();
      }
    }
  }

  activate () {
    this.active = true;
  }

  deactivate () {
    this.active = false;
  }

  onPress (action, callback) {
    if (!Object.keys(this.bindings).includes(action)) throw Error(`No key binding for action binding: ${action}`);
    this.press[action] = callback;
  }

  onRelease (action, callback) {
    if (!Object.keys(this.bindings).includes(action)) throw Error(`No key binding for action binding: ${action}`);
    this.release[action] = callback;
  }

  onHold (action, callback) {
    if (!Object.keys(this.bindings).includes(action)) throw Error(`No key binding for action binding: ${action}`);
    this.hold[action] = callback;
  }
}
