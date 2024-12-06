import { genBrightColor, genId, createDomNode } from '../utils.js';
import { Position } from '../position.js';
import { Sash } from '../sash.js';
import { createPaneElement, addPane as addPaneUtil, updatePaneElement } from './pane-utils.js';

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
  addPane(targetPaneSashId, { position, size }) {
    if (!position) throw new Error('[bwin] Position is required when adding pane');

    const parentSash = this.rootSash.getById(targetPaneSashId);
    if (!parentSash) throw new Error('[bwin] Parent sash not found when adding pane');

    const newPaneSash = addPaneUtil(parentSash, { position, size });
    // Generate new ID for parent sash to create a new muntin
    parentSash.id = genId();

    this.update();

    return newPaneSash;
  },

  /**
   * Remove a pane
   *
   * @param {string} sashId - The Sash ID of the pane to be removed
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
  },
};

function __debug(parentEl) {
  const debugEl = document.createElement('pre');
  debugEl.style.fontSize = '10px';

  const debugHtml = `
${parentEl.getAttribute('sash-id')}
${parentEl.getAttribute('position')}
top: ${parentEl.style.top}
left: ${parentEl.style.left}
width: ${parentEl.style.width}
height: ${parentEl.style.height}
`;

  debugEl.innerHTML = debugHtml.trim();
  return debugEl;
}
