// import C from '../constants.json';
import * as PIXI from 'pixi.js';
import * as PLANCK from 'planck-js';
import State from './State';
import { Corona, Paddle } from '../components';

function addPhysics (body) {
  console.log(body.getPoints());
}

export default class GameState extends State {
  constructor (app) {
    super(app);
    this.fpsText = new PIXI.Text(Math.round(app.ticker.FPS));
    this.fpsText.style.fill = 0xff0000;
    this.fpsText.x = 10;
    this.fpsText.y = 10;

    this.world = PLANCK.World();
    this.corona = new Corona(this.scene);
    this.paddle = new Paddle(this.corona);
    this.scene.addChild(this.fpsText);
    addPhysics(this.paddle);
  }

  run (delta) {
    super.run(delta);
    this.fpsText.text = Math.round(this.app.ticker.FPS);
    this.paddle.run(delta);
    this.world.step(delta);
  }

  resize (x, y) {
    this.corona.position(x / 2, y / 2);
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
