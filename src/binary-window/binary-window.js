import { Frame } from '../frame/frame';
import glassModule, { Glass } from './glass';
import { createDomNode } from '../utils';
import trimModule from './trim';
import detachedGlassModule from './detached-glass';

export class BinaryWindow extends Frame {
  sillElement = null;

  constructor(settings) {
    super(settings);

    this.theme = settings.theme || '';
    this.actions = BinaryWindow.normActions(settings.actions);
  }

  frame() {
    super.frame(...arguments);
    const sillEl = createDomNode('<bw-sill />');
    this.windowElement.append(sillEl);
    this.sillElement = sillEl;
  }

  enableFeatures() {
    super.enableFeatures();
    this.enableGlassFeature();
    this.enableDetachedGlassFeatures();
  }

  onPaneCreate(paneEl, sash) {
    const glassActions = this.actions[0];
    const glass = new Glass({ actions: glassActions, ...sash.store, sash, binaryWindow: this });

    paneEl.innerHTML = '';
    paneEl.append(glass.domNode);

    if (this.debug) {
      glass.contentElement.prepend(`${sash.id}`);
    }
  }

  onPaneUpdate() {
    // Overriding Frame's debug pane update
  }

  /**
   * Add a pane with glass into the target pane.
   *
   * @param {string} targetPaneSashId - The Sash ID of the target pane
   * @param {Object} props - The pane and glass properties grouped together
   * @returns {Sash} - The newly created Sash
   */
  addPane(targetPaneSashId, props) {
    const { position, size, id, ...glassProps } = props;
    const paneSash = super.addPane(targetPaneSashId, { position, size, id });
    const glass = new Glass({ ...glassProps, sash: paneSash, binaryWindow: this });
    paneSash.domNode.append(glass.domNode);
    return paneSash;
  }

  /**
   * Set the window theme.
   *
   * @param {string} theme - The theme name, set as the `theme` attribute on the `bw-window` element
   */
  setTheme(theme) {
    if (!theme) {
      this.theme = '';
      this.windowElement.removeAttribute('theme');
      return;
    }

    this.theme = theme;
    this.windowElement.setAttribute('theme', theme);
  }

  removePane(paneSashId) {
    const paneEl = this.windowElement.querySelector(`[sash-id="${paneSashId}"]`);

    if (paneEl) {
      super.removePane(paneSashId);
      return;
    }

    // Remove minimized glass element if pane is minimized
    const minimizedGlassEl = this.getMinimizedGlassElementBySashId(paneSashId);
    if (minimizedGlassEl) {
      minimizedGlassEl.remove();
    }
  }

  // Returns [glassActions, detachedGlassActions]
  static normActions(actions) {
    if (!Array.isArray(actions)) return [[], []];
    if (!actions.some(Array.isArray)) return [actions, []];
    return actions;
  }
}

BinaryWindow.assemble(glassModule, detachedGlassModule, trimModule);
