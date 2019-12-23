import * as PIXI from 'pixi.js';

export default class State {
  constructor (app) {
    this.app = app;
    this.active = false;
    this.scene = new PIXI.Container();
    this.scene.visible = false;

    app.stage.addChild(this.scene);
  }

  run (delta) { /* Overridden in subclass */ }

  resize (width, height) { /* Overridden in subclass */ }

  activate () {
    this.active = true;
    this.scene.visible = true;
  }

  deactivate () {
    this.active = false;
    this.scene.visible = false;
  }
}
