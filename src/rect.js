/**
 * @typedef {Object} Rect
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */

/**
 * Get the intersect rect of two rects
 *
 * @param {Rect} rect1 - Rect 1
 * @param {Rect} rect2 - Rect 2
 * @returns {Rect | null} - The intersection rect or null if there is no intersection
 */
export function getIntersectRect(rect1, rect2) {
  const rect1Right = rect1.left + rect1.width;
  const rect1Bottom = rect1.top + rect1.height;
  const rect2Right = rect2.left + rect2.width;
  const rect2Bottom = rect2.top + rect2.height;

  if (
    rect1.left >= rect2Right ||
    rect2.left >= rect1Right ||
    rect1.top >= rect2Bottom ||
    rect2.top >= rect1Bottom
  ) {
    return null;
  }

  const intersectLeft = Math.max(rect1.left, rect2.left);
  const intersectTop = Math.max(rect1.top, rect2.top);
  const intersectRight = Math.min(rect1Right, rect2Right);
  const Bottom = Math.min(rect1Bottom, rect2Bottom);

  return {
    left: intersectLeft,
    top: intersectTop,
    width: intersectRight - intersectLeft,
    height: Bottom - intersectTop,
  };
}
