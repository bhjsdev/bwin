import { parseSize } from './utils';
import { Position, Sash } from './sash';

const DEFAULTS = {
  size: '50%',
  position: Position.Left,
  domElement: null,
};

export class ConfigNode {
  left;
  top;
  width;
  height;

  constructor({
    size = DEFAULTS.size,
    position = DEFAULTS.position,
    domElement = DEFAULTS.domElement,
    parentRect,
    siblingNode,
    id,
    children,
  } = DEFAULTS) {
    this.size = this.getSize(size);
    this.position = this.getPosition(position);
    this.domElement = domElement;
    this.siblingNode = siblingNode;
    this.parentRect = parentRect;
    this.id = id;
    this.children = children;

    this.setBounds();
  }

  // TODO: return position based on siblingNode
  getPosition(position) {
    if (!this.siblingNode) {
      return position;
    }

    return position;
  }

  // TODO: return size based on siblingNode
  getSize(size) {
    if (!this.siblingNode) {
      return size;
    }

    return size;
  }

  setBounds() {
    const parsedSize = parseSize(this.size);

    if (this.position === Position.Root) {
      this.left = 0;
      this.top = 0;
      this.width = this.parentRect.width;
      this.height = this.parentRect.height;
    }
    else if (this.position === Position.Left) {
      const absoluteSize = parsedSize < 1 ? this.parentRect.width * parsedSize : parsedSize;
      this.left = this.parentRect.left;
      this.top = this.parentRect.top;
      this.width = absoluteSize;
      this.height = this.parentRect.height;
    }
    else if (this.position === Position.Right) {
      const absoluteSize = parsedSize < 1 ? this.parentRect.width * parsedSize : parsedSize;
      this.left = this.parentRect.left + this.parentRect.width - absoluteSize;
      this.top = this.parentRect.top;
      this.width = absoluteSize;
      this.height = this.parentRect.height;
    }
    else if (this.position === Position.Top) {
      const absoluteSize = parsedSize < 1 ? this.parentRect.height * parsedSize : parsedSize;
      this.left = this.parentRect.left;
      this.top = this.parentRect.top;
      this.width = this.parentRect.width;
      this.height = absoluteSize;
    }
    else if (this.position === Position.Bottom) {
      const absoluteSize = parsedSize < 1 ? this.parentRect.height * parsedSize : parsedSize;
      this.left = this.parentRect.left;
      this.top = this.parentRect.top + this.parentRect.height - absoluteSize;
      this.width = this.parentRect.width;
      this.height = absoluteSize;
    }
  }

  createSash() {
    return new Sash({
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height,
      position: this.position,
      id: this.id,
    });
  }

  buildSashTree() {
    const sash = this.createSash();

    if (!Array.isArray(this.children) || this.children.length === 0) {
      return sash;
    }

    const primaryChild = this.children?.at(0);
    // TODO: make default secondary child
    const secondaryChild = this.children?.at(1);

    const primaryChildNode = new ConfigNode({
      parentRect: this,
      size: primaryChild.size,
      position: primaryChild.position,
      children: primaryChild.children,
    });

    const secondaryChildNode = new ConfigNode({
      parentRect: this,
      size: secondaryChild.size,
      position: secondaryChild.position,
      children: secondaryChild.children,
    });

    if (primaryChildNode && secondaryChildNode) {
      sash.children.push(primaryChildNode.buildSashTree());
      sash.children.push(secondaryChildNode.buildSashTree());
    }

    return sash;
  }
}
