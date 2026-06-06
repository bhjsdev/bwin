import { Glass } from '../glass';
import { genId } from '@/utils.js';
import { genStylesByPosition } from './utils';
import { BUILTIN_ACTIONS_2 } from './close';

export class DetachedGlass extends Glass {
  constructor(options) {
    const {
      position = 'top-right',
      width = 200,
      height = 200,
      offset = -20,
      id,
      actions = BUILTIN_ACTIONS_2,
      ...glassOptions
    } = options;

    super({ ...glassOptions, actions });

    this.domNode.setAttribute('id', id || genId() + '-F');
    this.domNode.setAttribute('detached', '');

    this.domNode.style.position = 'absolute';
    this.domNode.style.width = `${width}px`;
    this.domNode.style.height = `${height}px`;

    const { top, left, right, bottom } = genStylesByPosition({ position, offset, width, height });

    this.domNode.style.top = top;
    this.domNode.style.left = left;
    this.domNode.style.right = right;
    this.domNode.style.bottom = bottom;
  }
}
