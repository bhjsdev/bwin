import { Frame } from '../frame/frame';
import glassModule, { Glass } from './glass';
import { createDomNode } from '../utils';
import trimModule from './trim';
import detachedGlassModule, { DetachedGlass, DEFAULT_WINDOWLESS_GLASS_ACTIONS } from './detached-glass';
import { detachedGlassManager } from './detached-glass/manager';
import { normActions } from './utils';

export class BinaryWindow extends Frame {
  sillElement = null;

  constructor(settings) {
    super(settings);

    this.theme = settings.theme || '';
    this.actions = normActions(settings.actions);
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
   * Add a pane into the target pane, optionally seeded with a glass built from
   * `glassProps`. Callers that mount their own existing glass (drag, restore)
   * pass `withGlass: false` to get a bare pane without glass.
   *
   * @param {string} targetPaneSashId - The Sash ID of the target pane
   * @param {Object} props - The pane and glass properties grouped together
   * @param {boolean} [props.withGlass=true] - Whether to seed the pane with a glass
   * @returns {Sash} - The newly created Sash
   */
  addPane(targetPaneSashId, props) {
    const { position, size, id, minWidth, minHeight, withGlass = true, ...glassProps } = props;
    const paneSash = super.addPane(targetPaneSashId, { position, size, id, minWidth, minHeight });
    if (withGlass) {
      const glass = new Glass({ ...glassProps, sash: paneSash, binaryWindow: this });
      paneSash.domNode.append(glass.domNode);
    }
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

  /**
   * Add a windowless glass: a detached glass that floats on `document.body` instead
   * of inside a `bw-window`, so it isn't owned by any window instance. Managed by the
   * shared glass manager (z-index/activation) like an in-window detached glass.
   *
   * @param {Object} [options] - Same shape as `addDetachedGlass`; `position` defaults to `center`.
   * @returns {DetachedGlass}
   */
  static addWindowlessGlass(options = {}) {
    const glass = new DetachedGlass({
      actions: DEFAULT_WINDOWLESS_GLASS_ACTIONS,
      position: 'center',
      ...options,
    });

    glass.domNode.setAttribute('windowless', '');

    document.body.append(glass.domNode);
    detachedGlassManager.addGlassByElement(glass.domNode);
    detachedGlassManager.bringToFront(glass.domNode);

    return glass;
  }
}

BinaryWindow.assemble(glassModule, detachedGlassModule, trimModule);
