import { genBrightColor, genId, createDomNode, swapChildNodes } from '../utils.js';
import { Position } from '../position.js';
import { Sash } from '../sash.js';
import {
  createPaneElement,
  addPaneSash,
  updatePanePosition,
  updatePaneSize,
} from './pane-utils.js';
import { getSashIdFromPane } from '../frame/frame-utils';

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

  /**
   * Update an existing pane's layout: its position (re-places it, keeping its
   * relative size), size, and/or min width/height.
   *
   * @param {string} id - The Sash ID of the pane to update
   * @param {Object} props
   * @param {'top'|'right'|'bottom'|'left'} [props.position] - New position of the pane
   * @param {string|number} [props.size] - New size along the split axis (px or fraction)
   * @param {number} [props.minWidth] - New min width
   * @param {number} [props.minHeight] - New min height
   * @returns {Sash} - The updated sash
   */
  updatePane(id, { position, size, minWidth, minHeight }) {
    const sash = this.rootSash.getById(id);
    if (!sash) throw new Error(`[bwin] No sash found with id ${id} when updating pane`);

    if (minWidth != null) sash.minWidth = minWidth;
    if (minHeight != null) sash.minHeight = minHeight;
    if (position) updatePanePosition(sash, position);
    if (size != null) updatePaneSize(sash, size);

    // `update` reconciles the DOM and calls `onPaneUpdate` for each existing pane.
    this.update();

    return sash;
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
  addPane(targetPaneSashId, { position, size, id, minWidth, minHeight }) {
    if (!position) throw new Error('[bwin] Position is required when adding pane');

    const targetPaneSash = this.rootSash.getById(targetPaneSashId);
    if (!targetPaneSash) throw new Error('[bwin] Parent sash not found when adding pane');

    const mustAdd = this.emit('before-pane-add', targetPaneSash);
    if (mustAdd === false) return null;

    const newPaneSash = addPaneSash(targetPaneSash, { position, size, id, minWidth, minHeight });
    this.update();

    this.emit('pane-add', newPaneSash);
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

    const sash = this.rootSash.getById(sashId);
    if (!sash) throw new Error('[bwin] Sash not found when removing pane');

    const mustRemove = this.emit('before-pane-remove', sash);
    if (mustRemove === false) return;

    const siblingSash = parentSash.getChildSiblingById(sashId);

    if (siblingSash.children.length === 0) {
      parentSash.id = siblingSash.id;
      parentSash.domNode = siblingSash.domNode;
      parentSash.domNode.setAttribute('sash-id', siblingSash.id);
      parentSash.children = [];
    }
    else {
      // The muntin with the old ID will be removed during `this.update`
      parentSash.id = genId();
      parentSash.children = siblingSash.children;
      parentSash.children.forEach((child) => (child.parent = parentSash));

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
    // `sash.domNode` still exists at this point,
    // but was removed from the DOM during `this.update()`
    this.emit('pane-remove', sash);
  },

  swapPanes(sourcePaneEl, targetPaneEl) {
    const sourcePaneSashId = getSashIdFromPane(sourcePaneEl);
    const targetPaneSashId = getSashIdFromPane(targetPaneEl);

    const sourcePaneCanDrop = sourcePaneEl.getAttribute('can-drop') !== 'false';
    const targetPaneCanDrop = targetPaneEl.getAttribute('can-drop') !== 'false';

    this.rootSash.swapIds(sourcePaneSashId, targetPaneSashId);
    swapChildNodes(sourcePaneEl, this.activeDropPaneEl);

    sourcePaneEl.setAttribute('sash-id', targetPaneSashId);
    targetPaneEl.setAttribute('sash-id', sourcePaneSashId);

    sourcePaneEl.setAttribute('can-drop', targetPaneCanDrop);
    targetPaneEl.setAttribute('can-drop', sourcePaneCanDrop);
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
