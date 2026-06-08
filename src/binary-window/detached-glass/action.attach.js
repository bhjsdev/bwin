export default {
  label: '',
  className: 'bw-glass-action--attach',
  onClick: (event, binaryWindow) => {
    console.log('Attach action clicked', { event, binaryWindow });

    const detachedGlassEl = event.target.closest('bw-glass[detached]');
    const originalPosition = detachedGlassEl.bwOriginalPosition;
    const originalSiblingSashId = detachedGlassEl.bwOriginalSiblingSashId;
    const originalRelativeSize = detachedGlassEl.bwOriginalRelativeSize;

    if (originalSiblingSashId) {
      // Original sibling now becomes the parent after detaching
      binaryWindow.addPane(originalSiblingSashId, {
        position: originalPosition,
        size: originalRelativeSize,
        content: detachedGlassEl.querySelector('bw-glass-content'),
        title: detachedGlassEl.querySelector('bw-glass-title')?.textContent || '',
      });

      binaryWindow.removeDetachedGlass(detachedGlassEl.id);
    }
  },
};
