import { ConfigRoot } from './config-root';
import { Sash } from '../sash';

export function mergeConfig(sashLikeObject, configRootLikeObject) {
  const glassPropsById = new Map();
  const configRoot = new ConfigRoot(configRootLikeObject);

  configRoot.buildSashTree().walk((sash) => {
    glassPropsById.set(sash.id, sash.store);
  });

  const sashLikeTree = trimSashLikeTree(sashLikeObject);
  const sashTree = new Sash(sashLikeTree);

  // Assign each node the glass props from its matching `configRoot` node.
  sashTree.walk((sash) => {
    const glassProps = glassPropsById.get(sash.id);

    if (glassProps) {
      sash.store = { ...glassProps };
    }
  });

  sashTree.fitContainer = configRootLikeObject.fitContainer;
  sashTree.theme = configRootLikeObject.theme;
  sashTree.actions = configRootLikeObject.actions;

  // "pots" are internally generated when "glass" is minimized
  // which should not be available in the configRootLikeObject
  sashTree.pots = sashLikeObject.pots.map((pot) => {
    const glassProps = glassPropsById.get(pot.originalSashId);

    return {
      ...pot,
      ...glassProps,
    };
  });

  return sashTree;
}

// Remove properties like `store`, making the tree serializable and suitable for export
// Note that each node is a plain object, not a Sash instance.
export function trimSashLikeTree(rootSash) {
  return {
    id: rootSash.id,
    position: rootSash.position,
    top: rootSash.top,
    left: rootSash.left,
    width: rootSash.width,
    height: rootSash.height,
    minWidth: rootSash.minWidth,
    minHeight: rootSash.minHeight,
    resizeStrategy: rootSash.resizeStrategy,
    children: rootSash.children.map(trimSashLikeTree),
  };
}
