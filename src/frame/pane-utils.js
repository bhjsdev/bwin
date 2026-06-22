import { parseSize, genId } from '../utils.js';
import { Position, getOppositePosition } from '../position.js';
import { Sash } from '../sash.js';

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

export function updatePaneElement(sash) {
  const paneEl = sash.domNode;
  paneEl.style.top = `${sash.top}px`;
  paneEl.style.left = `${sash.left}px`;
  paneEl.style.width = `${sash.width}px`;
  paneEl.style.height = `${sash.height}px`;
  paneEl.setAttribute('position', sash.position);

  return paneEl;
}

// Re-place a pane at `position`, keeping its current relative size. Same-axis
// change swaps it with its sibling; cross-axis change reorients the split.
export function updatePanePosition(sash, position) {
  const parent = sash.parent;
  if (!parent) return;

  const sibling = parent.getChildSiblingById(sash.id);
  if (!sibling) return;

  const parentRect = {
    top: parent.top,
    left: parent.left,
    width: parent.width,
    height: parent.height,
  };

  const fraction = sash.getRelativeSize();
  const wasLeftRight = parent.isLeftRightSplit();
  const willBeLeftRight = position === Position.Left || position === Position.Right;
  const axisChanged = wasLeftRight !== willBeLeftRight;

  sash.position = position;
  sibling.position = getOppositePosition(position);

  if (position === Position.Left || position === Position.Right) {
    const sashWidth = parentRect.width * fraction;

    sash.top = parentRect.top;
    sibling.top = parentRect.top;
    sash.height = parentRect.height;
    sibling.height = parentRect.height;
    sash.width = sashWidth;
    sibling.width = parentRect.width - sashWidth;

    if (position === Position.Left) {
      sash.left = parentRect.left;
      sibling.left = parentRect.left + sashWidth;
    }
    else {
      sibling.left = parentRect.left;
      sash.left = parentRect.left + sibling.width;
    }
  }
  else {
    const sashHeight = parentRect.height * fraction;

    sash.left = parentRect.left;
    sibling.left = parentRect.left;
    sash.width = parentRect.width;
    sibling.width = parentRect.width;
    sash.height = sashHeight;
    sibling.height = parentRect.height - sashHeight;

    if (position === Position.Top) {
      sash.top = parentRect.top;
      sibling.top = parentRect.top + sashHeight;
    }
    else {
      sibling.top = parentRect.top;
      sash.top = parentRect.top + sibling.height;
    }
  }

  // The muntin's orientation lives in its `vertical`/`horizontal` attribute, which
  // `updateMuntin` doesn't toggle. Force a fresh muntin on axis flip via `update`.
  if (axisChanged) {
    parent.id = genId();
  }
}

// Resize a pane to `size` along its current split axis, shrinking/growing the
// sibling to fill the parent. Mirrors the muntin-drag math in `resizable.js`.
export function updatePaneSize(sash, size) {
  const parent = sash.parent;
  if (!parent) return;

  const sibling = parent.getChildSiblingById(sash.id);
  if (!sibling) return;

  const parsed = parseSize(size);
  if (isNaN(parsed)) return;

  const parentRect = {
    top: parent.top,
    left: parent.left,
    width: parent.width,
    height: parent.height,
  };

  const isLeftRight = parent.isLeftRightSplit();
  const parentSize = isLeftRight ? parentRect.width : parentRect.height;
  const newSize = parsed < 1 ? parentSize * parsed : parsed;
  const siblingSize = parentSize - newSize;

  if (isLeftRight) {
    sash.width = newSize;
    sibling.width = siblingSize;
    if (sash.position === Position.Left) {
      sibling.left = parentRect.left + newSize;
    }
    else {
      sash.left = parentRect.left + siblingSize;
    }
  }
  else {
    sash.height = newSize;
    sibling.height = siblingSize;
    if (sash.position === Position.Top) {
      sibling.top = parentRect.top + newSize;
    }
    else {
      sash.top = parentRect.top + siblingSize;
    }
  }
}

function addPaneSashToLeft(targetPaneSash, { size, id, minWidth, minHeight }) {
  const sizeParsed = parseSize(size);
  let newLeftSashWidth = targetPaneSash.width / 2;

  if (sizeParsed) {
    sizeParsed < 1
      ? (newLeftSashWidth = targetPaneSash.width * sizeParsed)
      : (newLeftSashWidth = sizeParsed);
  }

  const newLeftSash = new Sash({
    id,
    top: targetPaneSash.top,
    left: targetPaneSash.left,
    width: newLeftSashWidth,
    height: targetPaneSash.height,
    minWidth,
    minHeight,
    position: Position.Left,
  });

  const newRightSash = new Sash({
    id: targetPaneSash.id,
    top: targetPaneSash.top,
    left: targetPaneSash.left + newLeftSash.width,
    width: targetPaneSash.width - newLeftSashWidth,
    height: targetPaneSash.height,
    position: Position.Right,
    domNode: targetPaneSash.domNode,
  });

  targetPaneSash.addChild(newLeftSash);
  targetPaneSash.addChild(newRightSash);
  targetPaneSash.domNode = null;
  // Generate a new ID for original target sash to be a new muntin during `update` call
  targetPaneSash.id = genId();

  return newLeftSash;
}

function addPaneSashToRight(targetPaneSash, { size, id, minWidth, minHeight }) {
  const sizeParsed = parseSize(size);
  let newRightSashWidth = targetPaneSash.width / 2;

  if (sizeParsed) {
    sizeParsed < 1
      ? (newRightSashWidth = targetPaneSash.width * sizeParsed)
      : (newRightSashWidth = sizeParsed);
  }

  const newLeftSash = new Sash({
    id: targetPaneSash.id,
    left: targetPaneSash.left,
    top: targetPaneSash.top,
    width: targetPaneSash.width - newRightSashWidth,
    height: targetPaneSash.height,
    position: Position.Left,
    domNode: targetPaneSash.domNode,
  });

  const newRightSash = new Sash({
    id,
    left: targetPaneSash.left + newLeftSash.width,
    top: targetPaneSash.top,
    width: newRightSashWidth,
    height: targetPaneSash.height,
    minWidth,
    minHeight,
    position: Position.Right,
  });

  targetPaneSash.addChild(newLeftSash);
  targetPaneSash.addChild(newRightSash);
  targetPaneSash.domNode = null;
  targetPaneSash.id = genId();

  return newRightSash;
}

function addPaneSashToTop(targetPaneSash, { size, id, minWidth, minHeight }) {
  const sizeParsed = parseSize(size);
  let newTopSashHeight = targetPaneSash.height / 2;

  if (sizeParsed) {
    sizeParsed < 1
      ? (newTopSashHeight = targetPaneSash.height * sizeParsed)
      : (newTopSashHeight = sizeParsed);
  }

  const newTopSash = new Sash({
    id,
    left: targetPaneSash.left,
    top: targetPaneSash.top,
    width: targetPaneSash.width,
    height: newTopSashHeight,
    minWidth,
    minHeight,
    position: Position.Top,
  });

  const newBottomSash = new Sash({
    id: targetPaneSash.id,
    left: targetPaneSash.left,
    top: targetPaneSash.top + newTopSash.height,
    width: targetPaneSash.width,
    height: targetPaneSash.height - newTopSashHeight,
    position: Position.Bottom,
    domNode: targetPaneSash.domNode,
  });

  targetPaneSash.addChild(newTopSash);
  targetPaneSash.addChild(newBottomSash);
  targetPaneSash.domNode = null;
  targetPaneSash.id = genId();

  return newTopSash;
}

function addPaneSashToBottom(targetPaneSash, { size, id, minWidth, minHeight }) {
  const sizeParsed = parseSize(size);
  let newBottomSashHeight = targetPaneSash.height / 2;

  if (sizeParsed) {
    sizeParsed < 1
      ? (newBottomSashHeight = targetPaneSash.height * sizeParsed)
      : (newBottomSashHeight = sizeParsed);
  }

  const newTopSash = new Sash({
    id: targetPaneSash.id,
    top: targetPaneSash.top,
    left: targetPaneSash.left,
    width: targetPaneSash.width,
    height: targetPaneSash.height - newBottomSashHeight,
    position: Position.Top,
    domNode: targetPaneSash.domNode,
  });

  const newBottomSash = new Sash({
    id,
    top: targetPaneSash.top + newTopSash.height,
    left: targetPaneSash.left,
    width: targetPaneSash.width,
    height: newBottomSashHeight,
    minWidth,
    minHeight,
    position: Position.Bottom,
  });

  targetPaneSash.addChild(newTopSash);
  targetPaneSash.addChild(newBottomSash);
  targetPaneSash.domNode = null;
  targetPaneSash.id = genId();

  return newBottomSash;
}

export function addPaneSash(targetPaneSash, { position, size, id, minWidth, minHeight }) {
  if (position === Position.Left) {
    return addPaneSashToLeft(targetPaneSash, { size, id, minWidth, minHeight });
  }
  else if (position === Position.Right) {
    return addPaneSashToRight(targetPaneSash, { size, id, minWidth, minHeight });
  }
  else if (position === Position.Top) {
    return addPaneSashToTop(targetPaneSash, { size, id, minWidth, minHeight });
  }
  else if (position === Position.Bottom) {
    return addPaneSashToBottom(targetPaneSash, { size, id, minWidth, minHeight });
  }
}
