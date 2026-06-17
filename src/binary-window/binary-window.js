import { Frame } from '../frame/frame';
import glassModule, { Glass, DEFAULT_GLASS_ACTIONS } from './glass';
import { createDomNode } from '../utils';
import trimModule from './trim';
import detachedGlassModule, { DEFAULT_DETACHED_GLASS_ACTIONS } from './detached-glass';

// debug ci
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

  // Returns [glassActions, detachedGlassActions]
  static normActions(actions) {
    if (actions === undefined) return [DEFAULT_GLASS_ACTIONS, DEFAULT_DETACHED_GLASS_ACTIONS];
    if (!actions || !Array.isArray(actions) || actions.length === 0) return [[], []];

    // [glassActions]
    if (actions.length === 1 && Array.isArray(actions[0])) return [actions[0], DEFAULT_DETACHED_GLASS_ACTIONS];

    // [action1, action2, ...]
    if (!actions.some(Array.isArray)) return [actions, DEFAULT_DETACHED_GLASS_ACTIONS];

    // [undefined, detachedGlassActions]
    if (actions.length >= 2 && !Array.isArray(actions[0]) && Array.isArray(actions[1]))
      return [[], actions[1]];

    // [glassActions, undefined]
    if (actions.length >= 2 && Array.isArray(actions[0]) && !Array.isArray(actions[1]))
      return [actions[0], []];

    // [glassActions, detachedGlassActions]
    if (actions.length >= 2 && Array.isArray(actions[0]) && Array.isArray(actions[1]))
      return actions;

    throw new Error(`[bwin] Invalid actions format`);
  }
}

BinaryWindow.assemble(glassModule, detachedGlassModule, trimModule);
