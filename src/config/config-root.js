import { ConfigNode } from './config-node';
import { Position } from '../position';

const DEFAULTS = {
  width: 333,
  height: 333,
};

export const FEAT_DEFAULTS = {
  fitContainer: false,
};

export class ConfigRoot extends ConfigNode {
  constructor(
    {
      id,
      children,
      width = DEFAULTS.width,
      height = DEFAULTS.height,
      fitContainer = FEAT_DEFAULTS.fitContainer,
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
  }
}
