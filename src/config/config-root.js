import { ConfigNode } from './config-node';
import { Position } from '../position';

// 333 is a debug sentinel: if it surfaces downstream, a real width/height failed to reach here.
const DEFAULTS = {
  width: 333,
  height: 333,
};

export const FEAT_DEFAULTS = {
  fitContainer: false,
  theme: '',
  actions: undefined,
};

export class ConfigRoot extends ConfigNode {
  constructor(
    {
      id,
      children,
      width = DEFAULTS.width,
      height = DEFAULTS.height,
      fitContainer = FEAT_DEFAULTS.fitContainer,
      theme = FEAT_DEFAULTS.theme,
      actions = FEAT_DEFAULTS.actions,
      ...rest
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
      ...rest,
    });

    this.fitContainer = fitContainer;
    this.theme = theme;
    this.actions = actions;
  }
}
