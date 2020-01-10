// import C from '../constants.json';
import * as PIXI from 'pixi.js';
import State from './State';
import { World } from '../physics';
import { Corona, Paddle } from '../components';

export default class GameState extends State {
  constructor (app) {
    super(app);
    this.testText = new PIXI.Text('test');
    this.testText.style.fill = 0xff0000;
    this.testText.x = 10;
    this.testText.y = 10;
    this.scene.addChild(this.testText);

    this.world = new World();
    this.corona = new Corona().makeSprite(this.scene).makeCollidable(this.world);
    this.paddle = new Paddle().makeSprite(this.scene).makeCollidable(this.world);
  }

  run (delta) {
    super.run(delta);
    this.corona.run(delta);
    this.paddle.run(delta);
    this.testText.text = this.app.ticker.FPS.toFixed();
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
