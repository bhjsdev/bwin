import { moveChildNodes, parseSize } from '../utils.js';
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

function addPaneToLeft(parentSash, { size }) {
  const sizeParsed = parseSize(size);
  let newLeftSashWidth = parentSash.width / 2;

  if (sizeParsed) {
    sizeParsed < 1
      ? (newLeftSashWidth = parentSash.width * sizeParsed)
      : (newLeftSashWidth = sizeParsed);
  }

  const newLeftSash = new Sash({
    top: parentSash.top,
    left: parentSash.left,
    width: newLeftSashWidth,
    height: parentSash.height,
    position: Position.Left,
  });

  const newRightSash = new Sash({
    top: parentSash.top,
    left: parentSash.left + newLeftSash.width,
    width: parentSash.width - newLeftSashWidth,
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

function addPaneToRight(parentSash, { size }) {
  const sizeParsed = parseSize(size);
  let newRightSashWidth = parentSash.width / 2;

  if (sizeParsed) {
    sizeParsed < 1
      ? (newRightSashWidth = parentSash.width * sizeParsed)
      : (newRightSashWidth = sizeParsed);
  }

  const newLeftSash = new Sash({
    left: parentSash.left,
    top: parentSash.top,
    width: parentSash.width - newRightSashWidth,
    height: parentSash.height,
    position: Position.Left,
  });

  const newRightSash = new Sash({
    left: parentSash.left + newLeftSash.width,
    top: parentSash.top,
    width: newRightSashWidth,
    height: parentSash.height,
    position: Position.Right,
  });

  const newPaneEl = createPaneElement(newLeftSash);
  newLeftSash.domNode = newPaneEl;
  moveChildNodes(newPaneEl, parentSash.domNode);

  parentSash.addChild(newLeftSash);
  parentSash.addChild(newRightSash);

  return newRightSash;
}

function addPaneToTop(parentSash, { size }) {
  const sizeParsed = parseSize(size);
  let newTopSashHeight = parentSash.height / 2;

  if (sizeParsed) {
    sizeParsed < 1
      ? (newTopSashHeight = parentSash.height * sizeParsed)
      : (newTopSashHeight = sizeParsed);
  }

  const newTopSash = new Sash({
    left: parentSash.left,
    top: parentSash.top,
    width: parentSash.width,
    height: newTopSashHeight,
    position: Position.Top,
  });

  const newBottomSash = new Sash({
    left: parentSash.left,
    top: parentSash.top + newTopSash.height,
    width: parentSash.width,
    height: parentSash.height - newTopSashHeight,
    position: Position.Bottom,
  });

  const newPaneEl = createPaneElement(newBottomSash);
  newBottomSash.domNode = newPaneEl;
  moveChildNodes(newPaneEl, parentSash.domNode);

  parentSash.addChild(newTopSash);
  parentSash.addChild(newBottomSash);

  return newTopSash;
}

function addPaneToBottom(parentSash, { size }) {
  const sizeParsed = parseSize(size);
  let newBottomSashHeight = parentSash.height / 2;

  if (sizeParsed) {
    sizeParsed < 1
      ? (newBottomSashHeight = parentSash.height * sizeParsed)
      : (newBottomSashHeight = sizeParsed);
  }

  const newTopSash = new Sash({
    top: parentSash.top,
    left: parentSash.left,
    width: parentSash.width,
    height: parentSash.height - newBottomSashHeight,
    position: Position.Top,
  });

  const newBottomSash = new Sash({
    top: parentSash.top + newTopSash.height,
    left: parentSash.left,
    width: parentSash.width,
    height: newBottomSashHeight,
    position: Position.Bottom,
  });

  const newPaneEl = createPaneElement(newTopSash);
  newTopSash.domNode = newPaneEl;
  moveChildNodes(newPaneEl, parentSash.domNode);

  parentSash.addChild(newTopSash);
  parentSash.addChild(newBottomSash);

  return newBottomSash;
}

/**
 * @todo add pane with more Sash props e.g. minWidth, minHeight, etc.
 */
export function addPane(parentSash, { position, size, minWidth, minHeight }) {
  if (position === Position.Left) {
    return addPaneToLeft(parentSash, { size });
  }
  else if (position === Position.Right) {
    return addPaneToRight(parentSash, { size });
  }
  else if (position === Position.Top) {
    return addPaneToTop(parentSash, { size });
  }
  else if (position === Position.Bottom) {
    return addPaneToBottom(parentSash, { size });
  }
}
