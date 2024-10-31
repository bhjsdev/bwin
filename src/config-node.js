import { genId } from './utils';
import { Position, Sash } from './sash';

const DEFAULTS = {
  size: '50%',
  position: Position.Left,
  domElement: null,
};

export class ConfigNode {
  constructor({
    size = DEFAULTS.size,
    position = DEFAULTS.position,
    domElement = DEFAULTS.domElement,
    id,
  } = DEFAULTS) {
    this.size = size;
    this.position = position;
    this.domElement = domElement;
    this.id = id;
  }

  buildSashTree({ left, top, width, height }) {
    const rootSash = new Sash({});
  }
}
