import { parseSize, isPlainObject } from './utils';
import { Sash } from './sash';
import { Position, getOppositePosition } from './position';

const PRIMARY_DEFAULTS = {
  size: '50%',
  position: Position.Left,
};

export class ConfigNode {
  left;
  top;
  width;
  height;

  constructor(config) {
    this.domNode = config.domNode;
    this.parentRect = config.parentRect;
    this.id = config.id;
    this.children = config.children;
    this.siblingConfigNode = config.siblingConfigNode;

    this.position = this.getPosition(config.position);
    this.size = this.getSize(config.size);

    this.setBounds();
  }

  getPosition(position) {
    if (!this.siblingConfigNode) {
      return position;
    }

    const oppositePositionOfSibling = getOppositePosition(this.siblingConfigNode.position);

    if (!position) {
      return oppositePositionOfSibling;
    }

    // Validation of explicit setting of both positions
    if (position !== oppositePositionOfSibling) {
      throw new Error('[bwin] Sibling position and current position are not opposite');
    }

    return position;
  }

  getSize(size) {
    if (!this.siblingConfigNode) {
      return parseSize(size);
    }

    if (!size) {
      if (this.siblingConfigNode.size < 1) {
        return 1 - this.siblingConfigNode.size;
      }
      else {
        if (
          this.siblingConfigNode.position === Position.Left ||
          this.siblingConfigNode.position === Position.Right
        ) {
          return this.parentRect.width - this.siblingConfigNode.width;
        }
        else if (
          this.siblingConfigNode.position === Position.Top ||
          this.siblingConfigNode.position === Position.Bottom
        ) {
          return this.parentRect.height - this.siblingConfigNode.height;
        }
      }
    }

    const parsedSize = parseSize(size);

    // Validation of explicit setting of both sizes
    if (parsedSize < 1) {
      if (parsedSize + this.siblingConfigNode.size !== 1) {
        throw new Error('[bwin] Sum of sibling sizes is not equal to 1');
      }
    }
    else {
      if (
        (this.position === Position.Left || this.position === Position.Right) &&
        parsedSize + this.siblingConfigNode.size !== this.parentRect.width
      ) {
        throw new Error('[bwin] Sum of sibling sizes is not equal to parent width');
      }

      if (
        (this.position === Position.Top || this.position === Position.Bottom) &&
        parsedSize + this.siblingConfigNode.size !== this.parentRect.height
      ) {
        throw new Error('[bwin] Sum of sibling sizes is not equal to parent height');
      }
    }

    return parsedSize;
  }

  setBounds() {
    if (this.position === Position.Root) {
      this.left = 0;
      this.top = 0;
      this.width = this.parentRect.width;
      this.height = this.parentRect.height;
    }
    else if (this.position === Position.Left) {
      const parsedSize = this.size < 1 ? this.parentRect.width * this.size : this.size;
      this.left = this.parentRect.left;
      this.top = this.parentRect.top;
      this.width = parsedSize;
      this.height = this.parentRect.height;
    }
    else if (this.position === Position.Right) {
      const absoluteSize = this.size < 1 ? this.parentRect.width * this.size : this.size;
      this.left = this.parentRect.left + this.parentRect.width - absoluteSize;
      this.top = this.parentRect.top;
      this.width = absoluteSize;
      this.height = this.parentRect.height;
    }
    else if (this.position === Position.Top) {
      const absoluteSize = this.size < 1 ? this.parentRect.height * this.size : this.size;
      this.left = this.parentRect.left;
      this.top = this.parentRect.top;
      this.width = this.parentRect.width;
      this.height = absoluteSize;
    }
    else if (this.position === Position.Bottom) {
      const absoluteSize = this.size < 1 ? this.parentRect.height * this.size : this.size;
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

  normConfig(config) {
    if (isPlainObject(config)) {
      return config;
    }
    else if (Array.isArray(config)) {
      return {
        children: config,
      };
    }
    else if (typeof config === 'string' || typeof config === 'number') {
      const size = parseSize(config);
      if (isNaN(size)) throw new Error(`[bwin] Invalid size value: ${size}`);

      return {
        size: config,
      };
    }
    else if (config === null || config === undefined) {
      return {};
    }
    else {
      throw new Error(`[bwin] Invalid config value: ${config}`);
    }
  }

  createPrimaryConfigNode(config) {
    return new ConfigNode({
      parentRect: this,
      size: config.size ?? PRIMARY_DEFAULTS.size,
      position: config.position ?? PRIMARY_DEFAULTS.position,
      children: config.children,
    });
  }

  createSecondaryConfigNode(config, primaryConfigNode) {
    return new ConfigNode({
      parentRect: this,
      size: config.size,
      position: config.position,
      children: config.children,
      siblingConfigNode: primaryConfigNode,
    });
  }

  buildSashTree() {
    const sash = this.createSash();

    if (!Array.isArray(this.children) || this.children.length === 0) {
      return sash;
    }

    const firstChildConfig = this.normConfig(this.children[0]);
    const secondChildConfig = this.normConfig(this.children.at(1));

    let primaryChildConfigNode;
    let secondaryChildConfigNode;

    // Use second child as primary if first child is like e.g. [[0.3, 0.7], 0.6]
    if (!firstChildConfig.size && !firstChildConfig.position && secondChildConfig) {
      if (!secondChildConfig.position) {
        secondChildConfig.position = Position.Right;
      }

      primaryChildConfigNode = this.createPrimaryConfigNode(secondChildConfig);
      secondaryChildConfigNode = this.createSecondaryConfigNode(
        firstChildConfig,
        primaryChildConfigNode
      );
    }
    else {
      primaryChildConfigNode = this.createPrimaryConfigNode(firstChildConfig);
      secondaryChildConfigNode = this.createSecondaryConfigNode(
        secondChildConfig,
        primaryChildConfigNode
      );
    }

    if (primaryChildConfigNode && secondaryChildConfigNode) {
      sash.children.push(primaryChildConfigNode.buildSashTree());
      sash.children.push(secondaryChildConfigNode.buildSashTree());
    }

    return sash;
  }
}
