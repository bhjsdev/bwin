import { createDomNode } from './utils';
import './vars.css';
import './glass.css';

const DEFAULTS = {
  title: null,
  content: null,
  tabs: [],
  actions: [],
};

const BUILTIN_ACTIONS = [{ label: '✕', className: 'bw-glass-action--close' }];

export class Glass {
  domNode;

  constructor({
    title = DEFAULTS.title,
    content = DEFAULTS.content,
    tabs = DEFAULTS.tabs,
    actions = DEFAULTS.actions,
  }) {
    this.title = title;
    this.content = content;
    this.tabs = tabs;
    this.actions = actions;
    this.build();
  }

  build() {
    const headerEl = document.createElement('bw-glass-header');

    if (Array.isArray(this.tabs) && this.tabs.length > 0) {
      headerEl.append(this.createTabs());
    }
    else if (this.title) {
      const titleEl = document.createElement('bw-glass-title');
      titleEl.append(createDomNode(this.title));
      headerEl.append(titleEl);
    }

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

  createActions() {
    const containerEl = document.createElement('bw-glass-action-container');

    for (const action of [...this.actions, ...BUILTIN_ACTIONS]) {
      const label = action?.label ?? action;
      const className = action.className
        ? `bw-glass-action ${action.className}`
        : 'bw-glass-action';

      const buttonEl = createDomNode(`<button class="${className}">${label}</button>`);
      containerEl.append(buttonEl);
    }

    return containerEl;
  }

  get contentElement() {
    return this.domNode.querySelector('bw-glass-content');
  }
}
