import { DEFAULT_DETACHED_GLASS_ACTIONS } from './detached-glass';
import { DEFAULT_GLASS_ACTIONS } from './glass';

// Returns [glassActions, detachedGlassActions]
export function normActions(actions) {
  if (actions === undefined) return [DEFAULT_GLASS_ACTIONS, DEFAULT_DETACHED_GLASS_ACTIONS];
  if (!actions || !Array.isArray(actions) || actions.length === 0) return [[], []];

  // [glassActions]
  if (actions.length === 1 && Array.isArray(actions[0]))
    return [actions[0], DEFAULT_DETACHED_GLASS_ACTIONS];

  // [action1, action2, ...]
  if (!actions.some(Array.isArray)) return [actions, DEFAULT_DETACHED_GLASS_ACTIONS];

  // [undefined, detachedGlassActions]
  if (actions.length >= 2 && !Array.isArray(actions[0]) && Array.isArray(actions[1]))
    return [[], actions[1]];

  // [glassActions, undefined]
  if (actions.length >= 2 && Array.isArray(actions[0]) && !Array.isArray(actions[1]))
    return [actions[0], []];

  // [glassActions, detachedGlassActions]
  if (actions.length >= 2 && Array.isArray(actions[0]) && Array.isArray(actions[1])) return actions;

  throw new Error(`[bwin] Invalid actions format`);
}
