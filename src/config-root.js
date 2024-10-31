import { ConfigNode } from './config-node';
import { Position, Sash } from './sash';

const DEFAULTS = {
  width: 555,
  height: 333,
};

export const FEAT_DEFAULTS = {
  resizable: true,
  fitContainer: false,
  minPaneSize: 20,
  maxPaneSize: Infinity,
};

export class ConfigRoot extends ConfigNode {
  constructor(
    { width, height, position = Position.Root, id, domElement = null } = {
      ...DEFAULTS,
      ...FEAT_DEFAULTS,
    }
  ) {
    super({ size: '100%', position, domElement, id });

    this.width = width;
    this.height = height;
  }

  makeSash() {
    return new Sash({
      width: this.width,
      height: this.height,
      position: this.position,
      domElement: this.domElement,
      id: this.id,
    });
  }
}
