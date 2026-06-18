// Moves the action list, title/tabs and content children from one glass to
// another, keeping the target's own header actions. Used when detaching/attaching.
export function transferGlass(sourceGlassElement, targetGlassElement) {
  const sourceHeaderEl = sourceGlassElement.querySelector('bw-glass-header');
  const targetHeaderEl = targetGlassElement.querySelector('bw-glass-header');

  // Remove the target's placeholder action list/title/tabs before adopting the source's
  targetHeaderEl.querySelector('bw-glass-action-list')?.remove();
  targetHeaderEl.querySelector('bw-glass-title')?.remove();
  targetHeaderEl.querySelector('bw-glass-tab-container')?.remove();

  const sourceActionListEl = sourceHeaderEl.querySelector('bw-glass-action-list');
  const sourceTitleEl = sourceHeaderEl.querySelector('bw-glass-title');
  const sourceTabsEl = sourceHeaderEl.querySelector('bw-glass-tab-container');

  // prepend in reverse of the build() order (action list, then title/tabs) so the
  // action list ends up first, ahead of the title/tabs and target's action container
  if (sourceTabsEl) targetHeaderEl.prepend(sourceTabsEl);
  if (sourceTitleEl) targetHeaderEl.prepend(sourceTitleEl);
  if (sourceActionListEl) targetHeaderEl.prepend(sourceActionListEl);

  // Move the source's custom actions (exclude builtin actions) into the target
  // TODO: actions need to be placed in same order, e.g.
  //       my-action-1 - minimize - detach - close - my-action-2 (from attached glass)
  //       my-action-1 - minimize - attach - close - my-action-2 (to detached glass)
  const sourceActionContainerEl = sourceHeaderEl.querySelector('bw-glass-action-container');
  const targetActionContainerEl = targetHeaderEl.querySelector('bw-glass-action-container');
  const customActionEls = [...(sourceActionContainerEl?.children ?? [])].filter(
    (actionEl) => !actionEl.bwActionType?.includes('builtin')
  );
  if (customActionEls.length > 0) targetActionContainerEl.prepend(...customActionEls);

  // append moves each node out of the source content element
  const sourceContentEl = sourceGlassElement.querySelector('bw-glass-content');
  const targetContentEl = targetGlassElement.querySelector('bw-glass-content');
  targetContentEl.append(...sourceContentEl.childNodes);
}
