export default {
  type: 'detached-glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--close',
  onClick: (event, binaryWindow) => {
    const glassEl = event.target.closest('bw-glass[detached]');
    if (!glassEl) return;

    binaryWindow.removeDetachedGlass(glassEl.id, {
      animateClose: true,
      onComplete: () => binaryWindow.emit('close', glassEl),
    });
  },
};
