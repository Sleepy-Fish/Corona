export default class World {
  constructor () {
    this.layers = {
      global: []
    };
  }

  add (body, layer = 'global') {
    if (this.layer(layer).indexOf(body) < 0) {
      this.layer(layer).push(body);
    }
  }

  remove (body, layer = 'global') {
    const index = this.layer(layer).indexOf(body);
    if (index >= 0) {
      this.layer(layer).splice(index, 1);
    }
  }

  layer (layer) {
    if (!this.layers[layer]) this.layers[layer] = [];
    return this.layers[layer];
  }
}
