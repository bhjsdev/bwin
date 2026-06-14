// Moves the title/tabs and content children from one glass to another, keeping
// the target's own header actions. Used when detaching/attaching a glass.
export function transferGlass(sourceGlassElement, targetGlassElement) {
  const sourceHeaderEl = sourceGlassElement.querySelector('bw-glass-header');
  const targetHeaderEl = targetGlassElement.querySelector('bw-glass-header');

  // Remove the target's placeholder title/tabs before adopting the source's
  targetHeaderEl.querySelector('bw-glass-title')?.remove();
  targetHeaderEl.querySelector('bw-glass-tab-container')?.remove();

  const sourceTitleEl = sourceHeaderEl.querySelector('bw-glass-title');
  const sourceTabsEl = sourceHeaderEl.querySelector('bw-glass-tab-container');

  // prepend keeps the title/tabs ahead of the target's action container
  if (sourceTabsEl) targetHeaderEl.prepend(sourceTabsEl);
  if (sourceTitleEl) targetHeaderEl.prepend(sourceTitleEl);

  // append moves each node out of the source content element
  const sourceContentEl = sourceGlassElement.querySelector('bw-glass-content');
  const targetContentEl = targetGlassElement.querySelector('bw-glass-content');
  targetContentEl.append(...sourceContentEl.childNodes);
}
