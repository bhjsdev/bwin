import { moveChildNodes } from '../utils.js';
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

function addPaneToLeft(parentSash) {
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

function addPaneToRight(parentSash) {
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

function addPaneToTop(parentSash) {
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

function addPaneToBottom(parentSash) {
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

export function addPaneByPosition(parentSash, position) {
  if (position === Position.Left) {
    return addPaneToLeft(parentSash);
  }
  else if (position === Position.Right) {
    return addPaneToRight(parentSash);
  }
  else if (position === Position.Top) {
    return addPaneToTop(parentSash);
  }
  else if (position === Position.Bottom) {
    return addPaneToBottom(parentSash);
  }
}
