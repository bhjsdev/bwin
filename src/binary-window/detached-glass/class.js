import { Glass } from '../glass';
import { genId } from '@/utils.js';
import { genStylesByPosition } from './utils';
import { closeAction } from './close';

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
      id,
      actions = [closeAction],
      ...glassOptions
    } = options;

    super({ ...glassOptions, actions });

    this.domNode.setAttribute('id', id || genId() + '-F');
    this.domNode.setAttribute('detached', '');

    this.domNode.style.position = 'absolute';
    this.domNode.style.width = `${width}px`;
    this.domNode.style.height = `${height}px`;

    const { top, left, right, bottom } = genStylesByPosition({
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
