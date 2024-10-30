import { Sash, Position } from './sash.js';

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
    element: parentSash.element,
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
    element: parentSash.element,
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
    element: parentSash.element,
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
    element: parentSash.element,
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
