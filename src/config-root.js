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
  minPaneSize: 0,
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
      minPaneSize = FEAT_DEFAULTS.minPaneSize,
      resizable = FEAT_DEFAULTS.resizable,
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
    this.minPaneSize = minPaneSize;
    this.resizable = resizable;
  }
}
