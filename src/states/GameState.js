// import C from '../constants.json';
import * as PIXI from 'pixi.js';
import State from './State';
import { World } from '../physics';
import { Corona, Paddle } from '../components';

export default class GameState extends State {
  constructor (app) {
    super(app);
    this.fpsText = new PIXI.Text(Math.round(app.ticker.FPS));
    this.fpsText.style.fill = 0xff0000;
    this.fpsText.x = 10;
    this.fpsText.y = 10;
    this.scene.addChild(this.fpsText);

    this.world = new World();
    this.corona = new Corona(this.scene);
    this.paddle = new Paddle(this.scene, this.world);
  }

  run (delta) {
    super.run(delta);
    this.fpsText.text = Math.round(this.app.ticker.FPS);
    this.corona.run(delta);
    this.paddle.run(delta);
  }

  resize (x, y) {
    this.corona.position(x / 2, y / 2);
    this.paddle.position(x / 2, y / 2);
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
