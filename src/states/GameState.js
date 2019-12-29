// import C from '../constants.json';
import * as PIXI from 'pixi.js';
import State from './State';
import { Point, Circle } from '../geom';
import { World, CircleCollide } from '../physics';
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
    this.paddle = new Paddle(this.corona, this.world);

    this.well = new CircleCollide(this.world, new Circle(Point.Zero(), this.paddle.radius), 'ball');
    this.well.on('enter', (actor, interactor) => { console.info('ENTER: ', actor, interactor); });
    this.well.on('leave', (actor, interactor) => { console.info('LEAVE: ', actor, interactor); });
    this.well.on('collide', (actor, interactor) => { console.info('COLLIDE: ', actor, interactor); });
  }

  run (delta) {
    super.run(delta);
    this.fpsText.text = Math.round(this.app.ticker.FPS);
    this.paddle.run(delta);
    this.well.run(delta);
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
