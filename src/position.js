export const Position = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
  Center: 'center',
  Root: 'root',
  Unknown: 'unknown',
  Outside: 'outside',
};

export function getOppositePosition(position) {
  switch (position) {
    case Position.Top:
      return Position.Bottom;
    case Position.Right:
      return Position.Left;
    case Position.Bottom:
      return Position.Top;
    case Position.Left:
      return Position.Right;
    default:
      throw new Error(`[bwin] Invalid position: ${position}`);
  }
}

function getMainDiagonalY({ width, height, x }) {
  return (height / width) * x;
}

function getMainDiagonalX({ width, height, y }) {
  return (width / height) * y;
}

function getMinorDiagonalY({ width, height, x }) {
  return height - (height / width) * x;
}

function getMinorDiagonalX({ width, height, y }) {
  return width - (width / height) * y;
}

/**
 * Get the cursor position relative to the element
 *
 * @returns {Position} The cursor position
 */
export function getCursorPosition(element, { clientX, clientY }) {
  const rect = element.getBoundingClientRect();
  const { width, height } = rect;

  const deltaX = clientX - rect.left;
  const deltaY = clientY - rect.top;

  if (deltaX < 0 || deltaX > width || deltaY < 0 || deltaY > height) {
    return Position.Outside;
  }
  const centerRadio = 0.3;

  const mainDiagonalY = getMainDiagonalY({ width, height, x: deltaX });
  const minorDiagonalY = getMinorDiagonalY({ width, height, x: deltaX });
  const mainDiagonalX = getMainDiagonalX({ width, height, y: deltaY });
  const minorDiagonalX = getMinorDiagonalX({ width, height, y: deltaY });

  if (
    deltaX < width * (0.5 - centerRadio / 2) &&
    deltaY > mainDiagonalY &&
    deltaY < minorDiagonalY
  ) {
    return Position.Left;
  }
  else if (
    deltaX > width * (0.5 + centerRadio / 2) &&
    deltaY < mainDiagonalY &&
    deltaY > minorDiagonalY
  ) {
    return Position.Right;
  }
  else if (
    deltaY < height * (0.5 - centerRadio / 2) &&
    deltaX > mainDiagonalX &&
    deltaX < minorDiagonalX
  ) {
    return Position.Top;
  }
  else if (
    deltaY > height * (0.5 + centerRadio / 2) &&
    deltaX < mainDiagonalX &&
    deltaX > minorDiagonalX
  ) {
    return Position.Bottom;
  }
  else if (
    deltaX > width * (0.5 - centerRadio / 2) &&
    deltaX < width * (0.5 + centerRadio / 2) &&
    deltaY > height * (0.5 - centerRadio / 2) &&
    deltaY < height * (0.5 + centerRadio / 2)
  ) {
    return Position.Center;
  }

  // When cursor is on boundaries
  // e.g. borders of center, borders of container, diagonals, etc
  return Position.Unknown;
}

export function isTopRightBottomLeftOrCenter(position) {
  return (
    position === Position.Top ||
    position === Position.Right ||
    position === Position.Bottom ||
    position === Position.Left ||
    position === Position.Center
  );
}
