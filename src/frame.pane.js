import { genBrightColor, genId, moveChildNodes, createDomNode } from './utils.js';
import { Position } from './position.js';
import { Sash } from './sash.js';

export default {
  createPane(sash) {
    const paneEl = createPaneElement(sash);

    if (sash.store.droppable === false) {
      paneEl.setAttribute('can-drop', 'false');
    }
    return paneEl;
  },

  // Intended to be overridden
  onPaneCreate(paneEl, sash) {
    if (sash.store.content) {
      paneEl.append(createDomNode(sash.store.content));
    }

    if (this?.debug) {
      paneEl.style.backgroundColor = genBrightColor();
      paneEl.innerHTML = '';
      paneEl.append(__debug(paneEl));
    }
  },

  updatePane(sash) {
    return updatePaneElement(sash);
  },

  // Intended to be overridden
  onPaneUpdate(paneEl, sash) {
    if (this?.debug) {
      paneEl.innerHTML = '';
      paneEl.append(__debug(paneEl));
    }
  },

  /**
   * Add a pane into the target pane. The two panes become next to each other
   *
   * @param {string} targetPaneSashId - The Sash ID of the target pane that the new pane moves into
   * @param {'top'|'right'|'bottom'|'left'} position - The position of the new pane relative to the target pane
   * @returns {Sash} - The newly created sash
   */
  addPane(targetPaneSashId, position) {
    if (!position) throw new Error('[bwin] Position is required when adding pane');

    const parentSash = this.rootSash.getById(targetPaneSashId);
    if (!parentSash) throw new Error('[bwin] Parent sash not found when adding pane');

    const newPaneSash = addPaneByPosition(parentSash, position);
    // Generate new ID for parent sash to create a new muntin
    parentSash.id = genId();

    this.update();

    return newPaneSash;
  },

  /**
   * Remove a pane
   *
   * @param {string} sashId - The Sash ID of the pane to be removed
   * @returns {string} - The new Sash ID of previous sibling pane
   */
  removePane(sashId) {
    const parentSash = this.rootSash.getDescendantParentById(sashId);
    if (!parentSash) throw new Error('[bwin] Parent sash not found when removing pane');

    const siblingSash = parentSash.getChildSiblingById(sashId);

    // The muntin of old ID will be removed in `this.update`
    parentSash.id = genId();

    if (siblingSash.children.length === 0) {
      parentSash.domNode = siblingSash.domNode;
      parentSash.domNode.setAttribute('sash-id', parentSash.id);
      parentSash.children = [];
    }
    else {
      parentSash.children = siblingSash.children;

      if (siblingSash.position === Position.Left) {
        siblingSash.width = parentSash.width;
      }
      else if (siblingSash.position === Position.Right) {
        siblingSash.width = parentSash.width;
        siblingSash.left = parentSash.left;
      }
      else if (siblingSash.position === Position.Top) {
        siblingSash.height = parentSash.height;
      }
      else if (siblingSash.position === Position.Bottom) {
        siblingSash.height = parentSash.height;
        siblingSash.top = parentSash.top;
      }
    }

    this.update();

    return parentSash.id;
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

  return paneEl;
}

function updatePaneElement(sash) {
  const paneEl = sash.domNode;
  paneEl.style.top = `${sash.top}px`;
  paneEl.style.left = `${sash.left}px`;
  paneEl.style.width = `${sash.width}px`;
  paneEl.style.height = `${sash.height}px`;
  paneEl.setAttribute('position', sash.position);

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

  return newLeftSash;
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

  return newRightSash;
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

  return newTopSash;
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

  return newBottomSash;
}

function addPaneByPosition(parentSash, position) {
  if (position === Position.Left) {
    return addLeftPane(parentSash);
  }
  else if (position === Position.Right) {
    return addRightPane(parentSash);
  }
  else if (position === Position.Top) {
    return addTopPane(parentSash);
  }
  else if (position === Position.Bottom) {
    return addBottomPane(parentSash);
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
