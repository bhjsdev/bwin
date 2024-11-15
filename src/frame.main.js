export default {
  windowEl: null,
  containerEl: null,

  init() {
    this.create();
  },

  create() {
    const windowEl = document.createElement('bw-window');
    windowEl.style.width = `${this.rootSash.width}px`;
    windowEl.style.height = `${this.rootSash.height}px`;
    windowEl.setAttribute('sash-id', this.rootSash.id);

    this.rootSash.walk((sash) => {
      let elem = null;

      // Prepend the new pane, so muntins are always on top
      if (sash.children.length > 0) {
        elem = this.createMuntin(sash);
        windowEl.append(elem);
      }
      else {
        elem = this.createPane(sash);
        windowEl.prepend(elem);
      }

      sash.domNode = elem;
    });

    this.containerEl.append(windowEl);
    this.windowEl = windowEl;
  },

  update() {
    this.windowEl.style.width = `${this.rootSash.width}px`;
    this.windowEl.style.height = `${this.rootSash.height}px`;

    const allSashIdsFromRoot = this.rootSash.getAllIds();
    const allSashIdsInWindow = [];

    this.windowEl.querySelectorAll('[sash-id]').forEach((el) => {
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
          this.windowEl.append(sash.domNode);
        }
        else {
          this.updateMuntin(sash);
        }
      }
      else {
        if (!allSashIdsInWindow.includes(sash.id)) {
          if (!sash.domNode) {
            sash.domNode = this.createPane(sash);
          }

          this.windowEl.prepend(sash.domNode);
        }
        else {
          this.updatePane(sash);
        }
      }
    });
  },
};
