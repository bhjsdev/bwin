import { genId } from './utils';

export const Position = {
  Top: Symbol('top'),
  Right: Symbol('right'),
  Bottom: Symbol('bottom'),
  Left: Symbol('left'),
  Root: Symbol('root'),
  Unknown: Symbol('unknown'),
};

const DEFAULTS = {
  top: 0,
  left: 0,
  width: 33,
  height: 33,
  position: Position.Unknown,
};

export class Sash {
  constructor({
    top = DEFAULTS.top,
    left = DEFAULTS.left,
    width = DEFAULTS.width,
    height = DEFAULTS.height,
    position = DEFAULTS.position,
    id,
  } = DEFAULTS) {
    // Relative position to its parent
    this._top = top;
    this._left = left;
    this._width = width;
    this._height = height;

    this.position = position;
    this.id = id ?? genId();
    this.children = [];
  }

  walk(callback) {
    this.children.forEach((child) => child.walk(callback));

    // Visit the deepest node first
    // So without giving z-index, muntins will be rendered on top of panes
    callback(this);
  }

  isVertSplit() {
    return this.children.some(
      (child) => child.position === Position.Left || child.position === Position.Right
    );
  }

  isHorzSplit() {
    return this.children.some(
      (child) => child.position === Position.Top || child.position === Position.Bottom
    );
  }

  getLeftChild() {
    return this.children.find((child) => child.position === Position.Left);
  }

  getRightChild() {
    return this.children.find((child) => child.position === Position.Right);
  }

  getTopChild() {
    return this.children.find((child) => child.position === Position.Top);
  }

  getBottomChild() {
    return this.children.find((child) => child.position === Position.Bottom);
  }

  getChildren() {
    let leftChild = null;
    let rightChild = null;
    let topChild = null;
    let bottomChild = null;

    for (const child of this.children) {
      if (child.position === Position.Left) {
        leftChild = child;
      }
      else if (child.position === Position.Right) {
        rightChild = child;
      }
      else if (child.position === Position.Top) {
        topChild = child;
      }
      else if (child.position === Position.Bottom) {
        bottomChild = child;
      }
    }

    return [topChild, rightChild, bottomChild, leftChild];
  }

  // Get self or child by id
  getById(id) {
    if (this.id === id) {
      return this;
    }

    for (const child of this.children) {
      const found = child.getById(id);
      if (found) {
        return found;
      }
    }

    return null;
  }

  get top() {
    return this._top;
  }

  set top(value) {
    const dist = value - this._top;
    this._top = value;

    const [topChild, rightChild, bottomChild, leftChild] = this.getChildren();

    if (topChild && bottomChild) {
      topChild.top += dist;
      bottomChild.top += dist;
    }

    if (leftChild && rightChild) {
      leftChild.top += dist;
      rightChild.top += dist;
    }
  }

  get left() {
    return this._left;
  }

  set left(value) {
    const dist = value - this._left;
    this._left = value;

    const [topChild, rightChild, bottomChild, leftChild] = this.getChildren();

    if (leftChild && rightChild) {
      leftChild.left += dist;
      rightChild.left += dist;
    }

    if (topChild && bottomChild) {
      topChild.left += dist;
      bottomChild.left += dist;
    }
  }

  get width() {
    return this._width;
  }

  set width(value) {
    const dist = value - this._width;
    this._width = value;

    const [topChild, rightChild, bottomChild, leftChild] = this.getChildren();

    if (leftChild && rightChild) {
      const leftDist = (dist * leftChild.width) / (leftChild.width + rightChild.width);
      const rightDist = dist - leftDist;

      leftChild.width += leftDist;
      rightChild.width += rightDist;
      rightChild.left += leftDist;
    }

    if (topChild && bottomChild) {
      topChild.width += dist;
      bottomChild.width += dist;
    }
  }

  get height() {
    return this._height;
  }

  set height(value) {
    const dist = value - this._height;
    this._height = value;

    const [topChild, rightChild, bottomChild, leftChild] = this.getChildren();

    if (topChild && bottomChild) {
      const topDist = (dist * topChild.height) / (topChild.height + bottomChild.height);
      const bottomDist = dist - topDist;

      topChild.height += topDist;
      bottomChild.height += bottomDist;
      bottomChild.top += topDist;
    }

    if (leftChild && rightChild) {
      leftChild.height += dist;
      rightChild.height += dist;
    }
  }
}
