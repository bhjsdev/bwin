export const Position = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
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

export function getCursorPosition(element, { clientX, clientY }) {
  const rect = element.getBoundingClientRect();
  const { width, height } = rect;

  const deltaX = clientX - rect.left;
  const deltaY = clientY - rect.top;

  if (deltaX < 0 || deltaX > width || deltaY < 0 || deltaY > height) {
    return Position.Outside;
  }

  const mainDiagonalY = getMainDiagonalY({ width, height, x: deltaX });
  const minorDiagonalY = getMinorDiagonalY({ width, height, x: deltaX });
  const mainDiagonalX = getMainDiagonalX({ width, height, y: deltaY });
  const minorDiagonalX = getMinorDiagonalX({ width, height, y: deltaY });

  if (deltaX < width / 2 && deltaY > mainDiagonalY && deltaY < minorDiagonalY) {
    return Position.Left;
  }
  else if (deltaX > width / 2 && deltaY < mainDiagonalY && deltaY > minorDiagonalY) {
    return Position.Right;
  }
  else if (deltaY < height / 2 && deltaX > mainDiagonalX && deltaX < minorDiagonalX) {
    return Position.Top;
  }
  else if (deltaY > height / 2 && deltaX < mainDiagonalX && deltaX > minorDiagonalX) {
    return Position.Bottom;
  }

  // When cursor is on the borders or diagonals
  return Position.Unknown;
}

export function isTopRightBottomOrLeft(position) {
  return (
    position === Position.Top ||
    position === Position.Right ||
    position === Position.Bottom ||
    position === Position.Left
  );
}
