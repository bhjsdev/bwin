// Moves the action menu, title/tabs and content children from one glass to
// another, keeping the target's own header actions. Used when detaching/attaching.
export function transferGlass(sourceGlassElement, targetGlassElement) {
  const sourceHeaderEl = sourceGlassElement.querySelector('bw-glass-header');
  const targetHeaderEl = targetGlassElement.querySelector('bw-glass-header');

  // Remove the target's placeholder action menu/title/tabs before adopting the source's
  targetHeaderEl.querySelector('.bw-action-menu-trigger')?.remove();
  targetHeaderEl.querySelector('bw-action-menu')?.remove();
  targetHeaderEl.querySelector('bw-glass-title')?.remove();
  targetHeaderEl.querySelector('bw-glass-tab-container')?.remove();

  const sourceTriggerEl = sourceHeaderEl.querySelector('.bw-action-menu-trigger');
  const sourceMenuEl = sourceHeaderEl.querySelector('bw-action-menu');
  const sourceTitleEl = sourceHeaderEl.querySelector('bw-glass-title');
  const sourceTabsEl = sourceHeaderEl.querySelector('bw-glass-tab-container');

  // prepend in reverse of the build() order (action menu trigger/menu, then title/tabs)
  // so the trigger ends up first, ahead of the title/tabs and target's action bar
  if (sourceTabsEl) targetHeaderEl.prepend(sourceTabsEl);
  if (sourceTitleEl) targetHeaderEl.prepend(sourceTitleEl);
  if (sourceMenuEl) targetHeaderEl.prepend(sourceMenuEl);
  if (sourceTriggerEl) targetHeaderEl.prepend(sourceTriggerEl);

  // Move the source's custom actions (exclude builtin actions) into the target
  // TODO: actions need to be placed in same order, e.g.
  //       my-action-1 - minimize - detach - close - my-action-2 (from attached glass)
  //       my-action-1 - minimize - attach - close - my-action-2 (to detached glass)
  const sourceActionBarEl = sourceHeaderEl.querySelector('bw-action-bar');
  const targetActionBarEl = targetHeaderEl.querySelector('bw-action-bar');
  const customActionEls = [...(sourceActionBarEl?.children ?? [])].filter(
    (actionEl) => !actionEl.getAttribute('bw-action-type')?.includes('builtin')
  );
  if (customActionEls.length > 0) targetActionBarEl.prepend(...customActionEls);

  // append moves each node out of the source content element
  const sourceContentEl = sourceGlassElement.querySelector('bw-glass-content');
  const targetContentEl = targetGlassElement.querySelector('bw-glass-content');
  targetContentEl.append(...sourceContentEl.childNodes);
}
