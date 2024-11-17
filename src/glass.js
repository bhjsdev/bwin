import './glass.css';
import { createDomNode } from './utils';

export class Glass {
  domNode;
  headerElement;
  contentElement;

  constructor({ content }) {
    this.build(content);
  }

  build(content) {
    this.domNode = document.createElement('bw-glass');
    this.headerElement = document.createElement('bw-glass-header');
    this.contentElement = document.createElement('bw-glass-content');
    this.domNode.append(this.headerElement, this.contentElement);

    const contentNode = createDomNode(content);
    contentNode && this.contentElement.append(contentNode);
  }
}
