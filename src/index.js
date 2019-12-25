// import C from './constants.json';
import * as PIXI from 'pixi.js';
import { GameState } from './states';

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
  autoResize: true,
  resolution: devicePixelRatio,
  width: window.innerWidth,
  height: window.innerHeight
});
document.body.appendChild(app.view);

window.addEventListener('resize', () => {
  app.renderer.resize(window.innerWidth, window.innerHeight);
  CurrentState.resize(window.innerWidth, window.innerHeight);
  app.width = app.renderer.width / app.renderer.resolution;
  app.height = app.renderer.height / app.renderer.resolution;
});

let CurrentState = null;
window.changeState = state => {
  return new Promise((resolve, reject) => {
    if (!(state in states)) reject(new Error(`${state} not state`));
    for (const key in states) states[key].deactivate();
    states[state].activate();
    CurrentState = states[state];
    resolve();
  });
};
const states = {
  game: new GameState(app)
};
window.changeState('game').then(() => {
  const loop = delta => CurrentState.run(delta);
  app.ticker.add(delta => loop(delta));
}).catch(console.error);
