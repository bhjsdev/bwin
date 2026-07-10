import { ConfigRoot } from './config-root';
import { Sash } from '../sash';

export function mergeConfig(sashConfigObject, configRootObject) {
  const glassPropsById = new Map();
  const configRoot = new ConfigRoot(configRootObject);

  configRoot.buildSashTree().walk((sash) => {
    glassPropsById.set(sash.id, sash.store);
  });

  const pureSashConfig = getPureSashConfig(sashConfigObject);
  const newSashConfig = new Sash(pureSashConfig);

  // Assign each node the glass props from its matching `configRoot` node.
  newSashConfig.walk((sash) => {
    const glassProps = glassPropsById.get(sash.id);

    if (glassProps) {
      sash.store = { ...glassProps };
    }
  });

  return newSashConfig;
}

export function getPureSashConfig(rootSash) {
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
    children: rootSash.children.map(getPureSashConfig),
  };
}
