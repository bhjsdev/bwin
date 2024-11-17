import './glass.css';
import { createDomNode } from './utils';

export class Glass {
  domNode;

  constructor({ content, title, tabs }) {
    this.title = title;
    this.content = content;
    this.tabs = tabs;
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

    const contentEl = document.createElement('bw-glass-content');
    const contentNode = createDomNode(this.content);

    contentNode && contentEl.append(contentNode);

    this.domNode = document.createElement('bw-glass');
    this.domNode.append(headerEl, contentEl);
  }

  createTabs() {
    const containerEl = document.createElement('bw-glass-tab-container');

    for (const tab of this.tabs) {
      const tabEl = document.createElement('bw-glass-tab');
      tabEl.append(createDomNode(tab?.label || tab));
      containerEl.append(tabEl);
    }

    return containerEl;
  }

  get contentElement() {
    return this.domNode.querySelector('bw-glass-content');
  }
}
