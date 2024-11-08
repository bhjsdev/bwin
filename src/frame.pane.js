import { genColor, genId, moveChildNodes } from './utils.js';
import { Position } from './position.js';
import { Sash } from './sash.js';

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
    // Store parent sash's element and use its content for a new pane
    domNode: parentSash.domNode,
  });

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
    domNode: parentSash.domNode,
  });

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
    domNode: parentSash.domNode,
  });

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
    domNode: parentSash.domNode,
  });

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

function debug(parentEl) {
  const debugEl = document.createElement('pre');
  debugEl.style.fontSize = '9px';

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

export const framePane = {
  // `createPane` will be overridden in `binary-window.js`
  createPane(sash, fromPaneEl) {
    const paneEl = document.createElement('bw-pane');
    paneEl.style.top = `${sash.top}px`;
    paneEl.style.left = `${sash.left}px`;
    paneEl.style.width = `${sash.width}px`;
    paneEl.style.height = `${sash.height}px`;

    paneEl.setAttribute('sash-id', sash.id);
    paneEl.setAttribute('position', sash.position);

    // Create the pane with the content of fromPaneEl
    if (fromPaneEl) {
      moveChildNodes(paneEl, fromPaneEl);
    }

    if (this.debug) {
      paneEl.style.backgroundColor = genColor();
      paneEl.append(debug(paneEl));
    }

    return paneEl;
  },

  updatePane(sash) {
    const paneEl = sash.domNode;
    paneEl.style.top = `${sash.top}px`;
    paneEl.style.left = `${sash.left}px`;
    paneEl.style.width = `${sash.width}px`;
    paneEl.style.height = `${sash.height}px`;

    if (this.debug) {
      const paneEl = sash.domNode;
      paneEl.innerHTML = '';
      paneEl.append(debug(paneEl));
    }
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
