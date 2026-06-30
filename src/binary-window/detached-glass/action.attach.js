import { transferGlass } from '../glass/utils';

export default {
  type: 'detached-glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--attach',
  onClick: async (event, binaryWindow) => {
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

    await binaryWindow.removeDetachedGlass(detachedGlassEl.id);

    const paneSash = binaryWindow.addPane(targetSashId, {
      position,
      size,
    });

    const targetGlassEl = paneSash.domNode.querySelector('bw-glass');
    transferGlass(detachedGlassEl, targetGlassEl);

    binaryWindow.emit('attach', paneSash.domNode.querySelector('bw-glass'));
  },
};
