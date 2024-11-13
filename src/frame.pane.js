import { genBrightColor, genId, moveChildNodes } from './utils.js';
import { Position } from './position.js';
import { Sash } from './sash.js';

export default {
  debug: true,

  // `createPane` is overridden in `binary-window.js`
  createPane(sash) {
    return createPaneElement.call(this, sash);
  },

  // `updatePane` may be overridden in `binary-window.js`, not yet
  updatePane(sash) {
    return updatePaneElement.call(this, sash);
  },

  addPane(parentSashId, position) {
    const parentSash = this.rootSash.getById(parentSashId);

    if (!parentSash) throw new Error('[bwin] Parent pane not found');
    if (!position) throw new Error('[bwin] Position is required');

    addPaneByPosition(parentSash, position);
    // Generate new ID for parent sash to create a new muntin
    parentSash.id = genId();

    this.update();
  },

  removePane(sashId) {
    const parentSash = this.rootSash.getDescendantParentById(sashId);
    const siblingSash = parentSash.getChildSiblingById(sashId);

    parentSash.domNode = siblingSash.domNode;
    // Remove all children, so it becomes a pane
    parentSash.children = [];
    // The muntin of old ID will be removed in `this.update`
    parentSash.id = genId();

    this.update();
  },
};

export function createPaneElement(sash) {
  const paneEl = document.createElement('bw-pane');
  paneEl.style.top = `${sash.top}px`;
  paneEl.style.left = `${sash.left}px`;
  paneEl.style.width = `${sash.width}px`;
  paneEl.style.height = `${sash.height}px`;
  paneEl.setAttribute('sash-id', sash.id);
  paneEl.setAttribute('position', sash.position);

  if (this?.debug) {
    paneEl.style.backgroundColor = genBrightColor();
    paneEl.append(__debug(paneEl));
  }

  return paneEl;
}

function updatePaneElement(sash) {
  const paneEl = sash.domNode;
  paneEl.style.top = `${sash.top}px`;
  paneEl.style.left = `${sash.left}px`;
  paneEl.style.width = `${sash.width}px`;
  paneEl.style.height = `${sash.height}px`;

  if (this?.debug) {
    paneEl.innerHTML = '';
    paneEl.append(__debug(paneEl));
  }

  return paneEl;
}

function addLeftPane(parentSash) {
  const newLeftSash = new Sash({
    top: parentSash.top,
    left: parentSash.left,
    width: parentSash.width / 2,
    height: parentSash.height,
    position: Position.Left,
  });

  const newRightSash = new Sash({
    top: parentSash.top,
    left: parentSash.left + newLeftSash.width,
    width: parentSash.width / 2,
    height: parentSash.height,
    position: Position.Right,
  });

  const newPaneEl = createPaneElement(newRightSash);
  newRightSash.domNode = newPaneEl;
  moveChildNodes(newPaneEl, parentSash.domNode);

  parentSash.addChild(newLeftSash);
  parentSash.addChild(newRightSash);
}

function addRightPane(parentSash) {
  const newLeftSash = new Sash({
    top: parentSash.top,
    left: parentSash.left,
    width: parentSash.width / 2,
    height: parentSash.height,
    position: Position.Left,
  });

  const newPaneEl = createPaneElement(newLeftSash);
  newLeftSash.domNode = newPaneEl;
  moveChildNodes(newPaneEl, parentSash.domNode);

  const newRightSash = new Sash({
    top: parentSash.top,
    left: parentSash.left + newLeftSash.width,
    width: parentSash.width / 2,
    height: parentSash.height,
    position: Position.Right,
  });

  parentSash.addChild(newLeftSash);
  parentSash.addChild(newRightSash);
}

function addTopPane(parentSash) {
  const newTopSash = new Sash({
    top: parentSash.top,
    left: parentSash.left,
    width: parentSash.width,
    height: parentSash.height / 2,
    position: Position.Top,
  });

  const newBottomSash = new Sash({
    top: parentSash.top + newTopSash.height,
    left: parentSash.left,
    width: parentSash.width,
    height: parentSash.height / 2,
    position: Position.Bottom,
  });

  const newPaneEl = createPaneElement(newBottomSash);
  newBottomSash.domNode = newPaneEl;
  moveChildNodes(newPaneEl, parentSash.domNode);

  parentSash.addChild(newTopSash);
  parentSash.addChild(newBottomSash);
}

function addBottomPane(parentSash) {
  const newTopSash = new Sash({
    top: parentSash.top,
    left: parentSash.left,
    width: parentSash.width,
    height: parentSash.height / 2,
    position: Position.Top,
  });

  const newPaneEl = createPaneElement(newTopSash);
  newTopSash.domNode = newPaneEl;
  moveChildNodes(newPaneEl, parentSash.domNode);

  const newBottomSash = new Sash({
    top: parentSash.top + newTopSash.height,
    left: parentSash.left,
    width: parentSash.width,
    height: parentSash.height / 2,
    position: Position.Bottom,
  });

  parentSash.addChild(newTopSash);
  parentSash.addChild(newBottomSash);
}

function addPaneByPosition(parentSash, position) {
  if (position === Position.Left) {
    addLeftPane(parentSash);
  }
  else if (position === Position.Right) {
    addRightPane(parentSash);
  }
  else if (position === Position.Top) {
    addTopPane(parentSash);
  }
  else if (position === Position.Bottom) {
    addBottomPane(parentSash);
  }
}

function __debug(parentEl) {
  const debugEl = document.createElement('pre');
  debugEl.style.fontSize = '10px';

  const debugHtml = `
id: ${parentEl.getAttribute('sash-id')}
top: ${parentEl.style.top}
left: ${parentEl.style.left}
width: ${parentEl.style.width}
height: ${parentEl.style.height}
position: ${parentEl.getAttribute('position')}
`;

  debugEl.innerHTML = debugHtml.trim();
  return debugEl;
}
