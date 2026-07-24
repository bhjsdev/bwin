import { Glass } from '../glass';
import { genId } from '@/utils.js';
import { generateMetricsByPosition } from './utils';
import closeAction from './action.close';
import attachAction from './action.attach';
import minimizeAction from './action.minimize';

export const DEFAULT_DETACHED_GLASS_ACTIONS = [minimizeAction, attachAction, closeAction];

// A windowless glass floats on `document.body` with no owning window, so minimize/attach
// (which need a `binaryWindow`) don't apply — close is the only built-in that works.
export const DEFAULT_WINDOWLESS_GLASS_ACTIONS = [closeAction];

export class DetachedGlass extends Glass {
  constructor(options) {
    const {
      position,
      // 222 is a deliberate debugging tell that addDetachedGlass's guard was bypassed.
      width = 222,
      height = 222,
      offset = 0,
      offsetX,
      offsetY,
      top,
      left,
      zIndex,
      active,
      minimized,
      id,
      resizable = true,
      actions = DEFAULT_DETACHED_GLASS_ACTIONS,
      ...glassOptions
    } = options;

    super({ ...glassOptions, actions });

    // `-D` for "detached"
    this.domNode.setAttribute('id', id || genId() + '-D');
    this.domNode.setAttribute('detached', '');
    // Mirrors the header's `can-drag`: the resize module skips glasses marked
    // `can-resize="false"`, so handles never appear on them.
    this.domNode.setAttribute('can-resize', resizable);

    this.domNode.style.position = 'absolute';
    this.domNode.style.width = `${width}px`;
    this.domNode.style.height = `${height}px`;
    if (zIndex !== undefined) this.domNode.style.zIndex = zIndex;
    if (active) this.domNode.setAttribute('active', '');
    if (minimized) this.domNode.setAttribute('minimized', '');

    // Explicit `top`/`left` anchor the glass directly; otherwise derive from `position`.
    if (top !== undefined || left !== undefined) {
      this.domNode.style.top = `${top ?? 0}px`;
      this.domNode.style.left = `${left ?? 0}px`;
      this.domNode.style.right = 'auto';
      this.domNode.style.bottom = 'auto';
    }
    else {
      const { top, left, right, bottom } = generateMetricsByPosition({
        position,
        offset,
        offsetX,
        offsetY,
        width,
        height,
      });

      this.domNode.style.top = top;
      this.domNode.style.left = left;
      this.domNode.style.right = right;
      this.domNode.style.bottom = bottom;
    }
  }
}
