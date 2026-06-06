import closeAction from './close';
import minimizeAction from './minimize';
import maximizeAction from './maximize';

export { Glass } from './class';
export { default } from './module';

export const BUILTIN_ACTIONS = [minimizeAction, maximizeAction, closeAction];
