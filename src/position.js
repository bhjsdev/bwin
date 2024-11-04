export const Position = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
  Root: 'root',
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
