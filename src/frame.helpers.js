import { Sash } from './sash.js';
import { Position } from './position.js';

export function addLeftPane(parentSash) {
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

export function addRightPane(parentSash) {
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

export function addTopPane(parentSash) {
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

export function addBottomPane(parentSash) {
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

export function addPaneByPosition(parentSash, position) {
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

export function debug(parentEl) {
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
