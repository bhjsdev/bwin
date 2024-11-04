import { Sash, DEFAULTS as SASH_DEFAULTS } from './sash';
import { FEAT_DEFAULTS } from './config-root';
import { Position } from './position';

export class SashConfig extends Sash {
  constructor(params = SASH_DEFAULTS) {
    super({ ...params, position: Position.Root });
    Object.assign(this, FEAT_DEFAULTS);
  }
}
