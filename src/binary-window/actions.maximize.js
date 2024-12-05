export default {
  label: '',
  className: 'bw-glass-action--maximize',
  onClick: (event) => {
    const paneEl = event.target.closest('bw-pane');

    if (paneEl.hasAttribute('maximized')) {
      paneEl.removeAttribute('maximized');
      paneEl.style.left = paneEl.bwOriginalBoundingBox.left;
      paneEl.style.top = paneEl.bwOriginalBoundingBox.top;
      paneEl.style.width = paneEl.bwOriginalBoundingBox.width;
      paneEl.style.height = paneEl.bwOriginalBoundingBox.height;
    }
    else {
      paneEl.setAttribute('maximized', '');
      paneEl.bwOriginalBoundingBox = {
        left: paneEl.style.left,
        top: paneEl.style.top,
        width: paneEl.style.width,
        height: paneEl.style.height,
      };
      paneEl.style.left = '0';
      paneEl.style.top = '0';
      paneEl.style.width = '100%';
      paneEl.style.height = '100%';
    }
  },
};
