export default {
  createWindow() {
    const windowEl = document.createElement('bw-window');
    windowEl.style.width = `${this.rootSash.width}px`;
    windowEl.style.height = `${this.rootSash.height}px`;
    windowEl.setAttribute('root-sash-id', this.rootSash.id);
    return windowEl;
  },

  glaze() {
    this.rootSash.walk((sash) => {
      let elem = null;

      // Prepend the new pane, so muntins are always on top
      if (sash.children.length > 0) {
        elem = this.createMuntin(sash);
        this.onMuntinCreate(elem, sash);
        this.windowElement.append(elem);
      }
      else {
        elem = this.createPane(sash);
        this.onPaneCreate(elem, sash);
        this.windowElement.prepend(elem);
      }

      sash.domNode = elem;
    });
  },

  update() {
    this.windowElement.style.width = `${this.rootSash.width}px`;
    this.windowElement.style.height = `${this.rootSash.height}px`;

    const allSashIdsFromRoot = this.rootSash.getAllIds();
    const allSashIdsInWindow = [];

    this.windowElement.querySelectorAll('[sash-id]').forEach((el) => {
      const sashId = el.getAttribute('sash-id');
      allSashIdsInWindow.push(sashId);

      if (!allSashIdsFromRoot.includes(sashId)) {
        el.remove();
      }
    });

    this.rootSash.walk((sash) => {
      if (sash.children.length > 0) {
        if (!allSashIdsInWindow.includes(sash.id)) {
          sash.domNode = this.createMuntin(sash);
          this.windowElement.append(sash.domNode);
        }
        else {
          this.updateMuntin(sash);
          this.onMuntinUpdate(sash.domNode, sash);
        }
      }
      else {
        if (!allSashIdsInWindow.includes(sash.id)) {
          if (!sash.domNode) {
            sash.domNode = this.createPane(sash);
          }

          this.windowElement.prepend(sash.domNode);
        }
        else {
          this.updatePane(sash);
          this.onPaneUpdate(sash.domNode, sash);
        }
      }
    });
  },
};
