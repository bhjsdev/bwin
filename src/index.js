import './css/vars.css';
import './css/frame.css';
import './css/glass.css';
import './css/glass.action.css';
import './css/detached-glass.css';
import './css/sill.css';
import './css/theme.css';

import { enableWindowlessGlassFeatures } from './binary-window/windowless-glass';

enableWindowlessGlassFeatures();

export { addWindowlessGlass, removeWindowlessGlass } from './binary-window/windowless-glass';
export { Frame } from './frame/frame';
export { BinaryWindow } from './binary-window/binary-window';
export { DEFAULT_GLASS_ACTIONS } from './binary-window/glass';
export {
  DEFAULT_DETACHED_GLASS_ACTIONS,
  DEFAULT_WINDOWLESS_GLASS_ACTIONS,
} from './binary-window/detached-glass';
export { Sash } from './sash';
export { ConfigRoot } from './config/config-root';
export { mergeConfig } from './config/utils';
export { Position } from './position';

// @deprecated - backwards compatibility only
export { BUILTIN_ACTIONS } from './binary-window/glass';
