import { parseSize, genId } from '../utils.js';
import { Position } from '../position.js';
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

function addPaneSashToLeft(targetPaneSash, { size, id }) {
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

function addPaneSashToRight(targetPaneSash, { size, id }) {
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
    position: Position.Right,
  });

  targetPaneSash.addChild(newLeftSash);
  targetPaneSash.addChild(newRightSash);
  targetPaneSash.domNode = null;
  targetPaneSash.id = genId();

  return newRightSash;
}

function addPaneSashToTop(targetPaneSash, { size, id }) {
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

function addPaneSashToBottom(targetPaneSash, { size, id }) {
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
    position: Position.Bottom,
  });

  targetPaneSash.addChild(newTopSash);
  targetPaneSash.addChild(newBottomSash);
  targetPaneSash.domNode = null;
  targetPaneSash.id = genId();

  return newBottomSash;
}

/**
 * @todo add pane with more Sash props e.g. minWidth, minHeight, etc.
 */
export function addPaneSash(targetPaneSash, { position, size, id, minWidth, minHeight }) {
  if (position === Position.Left) {
    return addPaneSashToLeft(targetPaneSash, { size, id });
  }
  else if (position === Position.Right) {
    return addPaneSashToRight(targetPaneSash, { size, id });
  }
  else if (position === Position.Top) {
    return addPaneSashToTop(targetPaneSash, { size, id });
  }
  else if (position === Position.Bottom) {
    return addPaneSashToBottom(targetPaneSash, { size, id });
  }
}
