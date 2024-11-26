import { Frame } from './frame';
import { Glass } from './glass';
import binaryWindowObservers from './binary-window.observers';

export class BinaryWindow extends Frame {
  mount(containerEl) {
    super.mount(containerEl);
    this.enableObservers();
  }

  onPaneCreate(paneEl, sash) {
    const glass = new Glass({ ...sash.store, sash, binaryWindow: this });

    paneEl.innerHTML = '';
    paneEl.append(glass.domNode);

    if (this.debug) {
      glass.contentElement.prepend(`[${sash.id}]`);
    }
  }

  onPaneUpdate() {
    // Overriding Frame's debug pane update
  }

  trimMuntin(muntinEl) {
    if (muntinEl.hasAttribute('vertical')) {
      muntinEl.style.top = `${parseFloat(muntinEl.style.top) + this.muntinSize / 2}px`;
      muntinEl.style.height = `${parseFloat(muntinEl.style.height) - this.muntinSize}px`;
    }
    else if (muntinEl.hasAttribute('horizontal')) {
      muntinEl.style.left = `${parseFloat(muntinEl.style.left) + this.muntinSize / 2}px`;
      muntinEl.style.width = `${parseFloat(muntinEl.style.width) - this.muntinSize}px`;
    }
  }

  onMuntinCreate(muntinEl) {
    this.trimMuntin(muntinEl);
  }

  onMuntinUpdate(muntinEl) {
    this.trimMuntin(muntinEl);
  }
}

BinaryWindow.assemble(binaryWindowObservers);
