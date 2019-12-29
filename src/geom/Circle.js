import Shape from './Shape';

export default class Circle extends Shape {
  constructor (position, radius) {
    super(position);
    this.radius = radius;
    this.type = 'circle';
  }
}
