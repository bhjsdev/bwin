export default {
  type: 'detached-glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--close',
  onClick: async (event, binaryWindow) => {
    const glassEl = event.target.closest('bw-glass[detached]');
    if (!glassEl) return;

    if (glassEl.hasAttribute('windowless')) {
      // Avoid circular dependency: import the remove function here instead of at the top of the file.
      const { removeWindowlessGlass } = await import('@/binary-window/windowless-glass.js');

      await removeWindowlessGlass(glassEl.id);
    }
    else {
      await binaryWindow.removeDetachedGlass(glassEl.id);
      binaryWindow.emit('close', glassEl);
    }
  },
};
