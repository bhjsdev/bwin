import { createDomNode } from '@/utils';
import closeAction from './action.close';
import minimizeAction from './action.minimize';
import detachAction from './action.detach';

export const DEFAULT_GLASS_ACTIONS = [minimizeAction, detachAction, closeAction];
export class Glass {
  domNode;

  constructor({
    title = null,
    content = null,
    tabs = [],
    actions = DEFAULT_GLASS_ACTIONS,
    draggable = true,
    sash = null,
    binaryWindow,
  }) {
    this.title = title;
    this.content = content;
    this.tabs = tabs;
    this.actions = actions;
    this.sash = sash;
    this.draggable = draggable;
    this.binaryWindow = binaryWindow;
    this.build();
  }

  build() {
    const headerEl = document.createElement('bw-glass-header');

    headerEl.append(document.createElement('bw-attach-indicator'));

    const menuActions = Array.isArray(this.actions)
      ? this.actions.filter((action) => action.placement === 'menu')
      : [];

    if (menuActions.length > 0) {
      headerEl.append(this.createActionMenu(menuActions));
    }

    if (Array.isArray(this.tabs) && this.tabs.length > 0) {
      headerEl.append(this.createTabs());
    }
    else {
      const titleEl = document.createElement('bw-glass-title');
      if (this.title) titleEl.append(createDomNode(this.title));
      headerEl.append(titleEl);
    }

    headerEl.setAttribute('can-drag', this.draggable);
    headerEl.append(this.createActions());

    const contentEl = document.createElement('bw-glass-content');
    const contentNode = createDomNode(this.content);

    contentNode && contentEl.append(contentNode);

    this.domNode = document.createElement('bw-glass');
    this.domNode.append(headerEl, contentEl);
  }

  createTabs() {
    const containerEl = document.createElement('bw-glass-tab-container');

    for (const tab of this.tabs) {
      const label = tab?.label ?? tab;
      const tabEl = createDomNode(`<button class="bw-glass-tab">${label}</button>`);
      containerEl.append(tabEl);
    }

    return containerEl;
  }

  createActionMenu(actions) {
    // The header scopes `anchor-name` (see glass.css) so multiple glasses can reuse
    // the same name without colliding; trigger + menu are its direct children.
    const triggerEl = createDomNode(`<button class="bw-action-menu-trigger"></button>`);
    const menuEl = document.createElement('bw-action-menu');

    menuEl.setAttribute('popover', 'auto');
    // Element reference instead of an `id` — nothing to collide on dynamic glasses.
    triggerEl.popoverTargetElement = menuEl;

    for (const action of actions) {
      const label = action?.label ?? action;
      const className = action.className ? `bw-action ${action.className}` : 'bw-action';

      const buttonEl = createDomNode(`<button class="${className}">${label}</button>`);

      if (typeof action.onClick === 'function') {
        buttonEl.addEventListener('click', (event) => {
          menuEl.hidePopover();
          action.onClick(event, this.binaryWindow);
        });
      }

      menuEl.append(buttonEl);
    }

    const fragment = document.createDocumentFragment();
    fragment.append(triggerEl, menuEl);

    return fragment;
  }

  createActions() {
    const containerEl = document.createElement('bw-action-bar');
    const actions = Array.isArray(this.actions)
      ? this.actions.filter(
          (action) => action.placement === undefined || action.placement === 'bar'
        )
      : [];

    for (const action of actions) {
      const label = action?.label ?? action;
      const className = action.className ? `bw-action ${action.className}` : 'bw-action';

      const buttonEl = createDomNode(`<button class="${className}">${label}</button>`);

      // Stamp the type so transferGlass can tell custom actions from builtins.
      if (action.type) buttonEl.setAttribute('bw-action-type', action.type);

      if (typeof action.onClick === 'function') {
        buttonEl.addEventListener('click', (event) => {
          action.onClick(event, this.binaryWindow);
        });
      }

      containerEl.append(buttonEl);
    }

    return containerEl;
  }

  get contentElement() {
    return this.domNode.querySelector('bw-glass-content');
  }

  get headerElement() {
    return this.domNode.querySelector('bw-glass-header');
  }

  get titleElement() {
    return this.domNode.querySelector('bw-glass-title');
  }
}
