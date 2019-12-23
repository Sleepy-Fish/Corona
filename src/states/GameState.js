// import C from '../constants.json';
import * as PIXI from 'pixi.js';
import State from './State';

export default class GameState extends State {
  constructor (app) {
    super(app);
    this.fpsText = new PIXI.Text(Math.round(app.ticker.FPS));
    this.fpsText.style.fill = 0xff0000;
    this.fpsText.x = 10;
    this.fpsText.y = 10;

    this.scene.addChild(this.fpsText);
  }

  run (delta) {
    super.run(delta);
    this.fpsText = Math.round(this.app.ticker.FPS);
  }

  activate () {
    super.activate();
    // Do something
  }

  deactivate () {
    super.deactivate();
    // Do something
  }
}
