import { ConfigNode } from './config-node';
import { Position } from './position';

const DEFAULTS = {
  width: 333,
  height: 333,
};

export const FEAT_DEFAULTS = {
  droppable: true,
  resizable: true,
  fitContainer: false,
  onDrop: null,
};

export class ConfigRoot extends ConfigNode {
  constructor(
    {
      id,
      children,
      width = DEFAULTS.width,
      height = DEFAULTS.height,
      droppable = FEAT_DEFAULTS.droppable,
      fitContainer = FEAT_DEFAULTS.fitContainer,
      resizable = FEAT_DEFAULTS.resizable,
      onDrop = FEAT_DEFAULTS.onDrop,
    } = {
      ...DEFAULTS,
      ...FEAT_DEFAULTS,
    }
  ) {
    super({
      id,
      children,
      size: NaN,
      position: Position.Root,
      parentRect: { width, height },
    });

    this.droppable = droppable;
    this.fitContainer = fitContainer;
    this.resizable = resizable;
    this.onDrop = onDrop;
  }
}
