// FLIP-style flight: shrink and fly `sourceEl` onto `targetEl`, then fade out.
// Both must be laid out (in the DOM, not `display:none`) so their rects measure.
// Resolves when the flight ends (e.g. to then hide/remove the source).
export function animateElementToElement(sourceEl, targetEl) {
  const SHRINK_FLIGHT_DURATION = 180;

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  const scaleX = targetRect.width / sourceRect.width;
  const scaleY = targetRect.height / sourceRect.height;
  const translateX = targetRect.left - sourceRect.left;
  const translateY = targetRect.top - sourceRect.top;

  sourceEl.style.pointerEvents = 'none';

  const animation = sourceEl.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      {
        transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
        opacity: 0,
      },
    ],
    { duration: SHRINK_FLIGHT_DURATION, easing: 'ease-in' }
  );

  // top-left origin so the translate/scale maps the source corner onto the target corner
  sourceEl.style.transformOrigin = 'top left';

  return animation.finished.then(() => {
    sourceEl.style.pointerEvents = '';
    sourceEl.style.transformOrigin = '';
  });
}
