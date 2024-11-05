import { ConfigNode } from './config-node';
import { Position } from './position';

const DEFAULTS = {
  width: 333,
  height: 333,
};

export const FEAT_DEFAULTS = {
  resizable: true,
  droppable: true,
  fitContainer: false,
  minPaneSize: 20,
  maxPaneSize: Infinity,
};

export class ConfigRoot extends ConfigNode {
  constructor(
    {
      width = DEFAULTS.width,
      height = DEFAULTS.height,
      resizable = FEAT_DEFAULTS.resizable,
      fitContainer = FEAT_DEFAULTS.fitContainer,
      droppable = FEAT_DEFAULTS.droppable,
      minPaneSize = FEAT_DEFAULTS.minPaneSize,
      maxPaneSize = FEAT_DEFAULTS.maxPaneSize,
      children,
      id,
    } = {
      ...DEFAULTS,
      ...FEAT_DEFAULTS,
    }
  ) {
    super({
      id,
      size: '100%',
      position: Position.Root,
      parentRect: { width, height },
      children,
    });

    this.resizable = resizable;
    this.fitContainer = fitContainer;
    this.droppable = droppable;
    this.minPaneSize = minPaneSize;
    this.maxPaneSize = maxPaneSize;
  }
}
