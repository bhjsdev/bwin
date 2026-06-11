export default {
  label: '',
  className: 'bw-glass-action--attach',
  onClick: (event, binaryWindow) => {
    const detachedGlassEl = event.target.closest('bw-glass[detached]');
    const originalPosition = detachedGlassEl.bwOriginalPosition;
    const originalSiblingSashId = detachedGlassEl.bwOriginalSiblingSashId;
    const originalRelativeSize = detachedGlassEl.bwOriginalRelativeSize;

    const originalSiblingSash = binaryWindow.rootSash.getById(originalSiblingSashId);

    let targetSashId = originalSiblingSashId;
    let position = originalPosition;
    let size = originalRelativeSize;

    // The sibling we split off from may be gone; fall back to the largest pane,
    // splitting along its longer side (right if flat, bottom if tall).
    if (!originalSiblingSash) {
      const largestLeafSash = binaryWindow.rootSash.getLargestLeaf();
      targetSashId = largestLeafSash.id;
      position = largestLeafSash.width > largestLeafSash.height ? 'right' : 'bottom';
      size = 0.5;
    }

    // Restore from the stashed store — content/title/tabs/actions/flags all return.
    // Its live content/title wrappers are adopted back out of the detached glass.
    binaryWindow.addPane(targetSashId, { position, size, ...detachedGlassEl.bwStore });

    binaryWindow.removeDetachedGlass(detachedGlassEl.id);
  },
};
