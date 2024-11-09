import { genId } from './utils';
import { Position } from './position';

export const DEFAULTS = {
  top: 0,
  left: 0,
  width: 33,
  height: 33,
  // If grandparent resizes, the width is likely to be less than minWidth
  minWidth: 20,
};

/**
 * @todo: Add a min size to stop sash from resizing when parent is resized
 */
export class Sash {
  constructor({
    top = DEFAULTS.top,
    left = DEFAULTS.left,
    width = DEFAULTS.width,
    height = DEFAULTS.height,
    minWidth = DEFAULTS.minWidth,
    parent = null,
    domNode = null,
    position,
    id,
  } = DEFAULTS) {
    // Relative position to its parent
    this._top = top;
    this._left = left;
    this._width = width;
    this._height = height;

    if (!position) {
      throw new Error('[bwin] Sash position is required');
    }

    this.position = position;
    this.domNode = domNode;
    this.id = id ?? genId();
    this.dom;
    this.children = [];
    this.minWidth = minWidth;
    this.parent = parent;
  }

  walk(callback) {
    this.children.forEach((child) => child.walk(callback));

    // Visit the deepest node first
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

  getAllLeafDescendants() {
    const leafDescendants = [];

    this.walk((node) => {
      if (node.children.length === 0) {
        leafDescendants.push(node);
      }
    });

    return leafDescendants;
  }

  calcMinWidth() {
    const leafDescendants = this.getAllLeafDescendants();

    let totalHorzMinWidth = 0;
    let biggestVertMinWidth = 0;

    for (const each of leafDescendants) {
      if (each.position === Position.Left || each.position === Position.Right) {
        totalHorzMinWidth += each.minWidth;
      }
      else if (each.position === Position.Top || each.position === Position.Bottom) {
        biggestVertMinWidth = Math.max(biggestVertMinWidth, each.minWidth);
      }
    }

    return Math.max(totalHorzMinWidth, biggestVertMinWidth, this.minWidth);
  }

  // Get self or descendant by id
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

  // Get all ids of self and descendants
  getAllIds() {
    const ids = [this.id];

    for (const child of this.children) {
      ids.push(...child.getAllIds());
    }

    return ids;
  }

  addChild(sash) {
    if (this.children.length >= 2) {
      throw new Error('[bwin] Maximum 2 children allowed');
    }

    this.children.push(sash);
  }

  getDescendantParentById(descendantId) {
    for (const child of this.children) {
      if (child.id === descendantId) {
        return this;
      }

      const found = child.getDescendantParentById(descendantId);
      if (found) {
        return found;
      }
    }

    return null;
  }

  getChildSiblingById(childId) {
    return this.children.find((child) => child.id !== childId);
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
      const totalWidth = leftChild.width + rightChild.width;
      const leftDist = dist * (leftChild.width / totalWidth);
      const rightDist = dist * (rightChild.width / totalWidth);

      let newLeftChildWidth = leftChild.width + leftDist;
      let newRightChildWidth = rightChild.width + rightDist;
      let newRightChildLeft = rightChild.left + leftDist;

      // `newTotalWidth` is not same as `totalWidth` when minWidth is taken into account
      const newTotalWidth = newLeftChildWidth + newRightChildWidth;

      if (newLeftChildWidth < leftChild.minWidth && newRightChildWidth > rightChild.minWidth) {
        newLeftChildWidth = leftChild.minWidth;
        newRightChildWidth = newTotalWidth - newLeftChildWidth;
        newRightChildLeft = leftChild.left + newLeftChildWidth;
      }
      else if (
        newRightChildWidth < rightChild.minWidth &&
        newLeftChildWidth > leftChild.minWidth
      ) {
        newRightChildWidth = rightChild.minWidth;
        newLeftChildWidth = newTotalWidth - newRightChildWidth;
        newRightChildLeft = leftChild.left + newLeftChildWidth;
      }
      else if (
        newLeftChildWidth < leftChild.minWidth &&
        newRightChildWidth < rightChild.minWidth
      ) {
        // When child reaches min width, but grandparent keeps resizing
        // In this case, children will be resized to less than their min width
      }

      leftChild.width = newLeftChildWidth;
      rightChild.width = newRightChildWidth;
      rightChild.left = newRightChildLeft;
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
      const topDist = dist * (topChild.height / (topChild.height + bottomChild.height));
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
