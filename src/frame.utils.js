export function getSashIdFromPane(innerElement) {
  if (innerElement.tagName === 'BW-PANE') {
    return innerElement.getAttribute('sash-id');
  }

  const paneEl = innerElement.closest('bw-pane');

  if (!paneEl) {
    throw new Error('[bwin] Pane element not found');
  }

  return paneEl.getAttribute('sash-id');
}
