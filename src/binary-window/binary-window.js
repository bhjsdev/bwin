import { Frame } from '../frame/frame';
import glassModule, { Glass } from './glass';
import { createDomNode } from '../utils';
import trimModule from './trim';
import sillModule from './sill';
import detachedGlassModule, {
  DetachedGlass,
  DEFAULT_WINDOWLESS_GLASS_ACTIONS,
} from './detached-glass';
import { detachedGlassManager } from './detached-glass/manager';
import { normActions } from './utils';
import { updateGlass } from './glass/utils';
import dragNewModule from './drag-new';

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
    this.enableGlassFeatures();
    this.enableSillFeatures();
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

  // TODO: support updating glass `actions` (rebuild the action bar/menu in place).
  updatePane({ position, size, id, minWidth, minHeight, title, content }) {
    const sash = this.rootSash.getById(id);
    if (!sash) throw new Error(`[bwin] No sash found with id ${id} when updating pane`);

    if (position || size || minWidth || minHeight) {
      super.updatePane(id, { position, size, minWidth, minHeight });
    }

    if (title || content) {
      const glassEl = sash.domNode.querySelector('bw-glass');
      if (!glassEl)
        throw new Error(`[bwin] No glass found in pane with id ${id} when updating pane`);
      updateGlass(glassEl, { title, content });
    }
  }

  removePane(paneSashId) {
    const paneEl = this.windowElement.querySelector(`[sash-id="${paneSashId}"]`);

    if (paneEl) {
      super.removePane(paneSashId);
      return;
    }

    // Remove the glass's sill pot if it was minimized
    const potEl = this.getPotElementBySashId(paneSashId);
    if (potEl) {
      potEl.remove();
    }
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

  /**
   * Add a windowless glass: a detached glass that floats on `document.body` instead
   * of inside a `bw-window`, so it isn't owned by any window instance. Managed by the
   * shared glass manager (z-index/activation) like an in-window detached glass.
   *
   * @param {Object} [options]
   * @param {boolean} [options.modal] - When true, append a `<bw-glass-backdrop for="<glassId>">`
   *   behind the glass to block interaction with everything underneath.
   * @param {'center'|'top-left'|'top-right'|'bottom-left'|'bottom-right'} [options.position='center'] - Where to anchor the glass.
   * @param {number} [options.width] - Glass width in px.
   * @param {number} [options.height] - Glass height in px.
   * @param {number} [options.offset=0] - Distance in px from the anchored corner/edge (no effect on `center`).
   * @param {number} [options.offsetX] - Per-axis override of `offset` on the x-axis.
   * @param {number} [options.offsetY] - Per-axis override of `offset` on the y-axis.
   * @param {string} [options.id] - Glass id; auto-generated (suffixed `-F`) when omitted.
   * @param {Object[]} [options.actions] - Action buttons; defaults to `DEFAULT_WINDOWLESS_GLASS_ACTIONS` (close only).
   * @param {string|Node} [options.title] - Header title.
   * @param {string|Node} [options.content] - Glass body content.
   * @param {Object[]} [options.tabs] - Header tabs (shown instead of `title`).
   * @param {boolean} [options.draggable=true] - Whether the header can be dragged to move the glass.
   * @returns {DetachedGlass}
   */
  static addWindowlessGlass(options = {}) {
    const { modal, ...glassOptions } = options;

    const glass = new DetachedGlass({
      actions: DEFAULT_WINDOWLESS_GLASS_ACTIONS,
      position: 'center',
      ...glassOptions,
    });

    glass.domNode.setAttribute('windowless', '');

    document.body.append(glass.domNode);
    detachedGlassManager.addDetachedGlassByElement(glass.domNode);
    // bringToFront reserves the z-index slot just below the glass for this backdrop.
    const glassZIndex = detachedGlassManager.bringToFront(glass.domNode);

    if (modal) {
      const backdropEl = document.createElement('bw-glass-backdrop');
      backdropEl.setAttribute('for', glass.domNode.id);
      backdropEl.style.zIndex = glassZIndex - 1;
      document.body.append(backdropEl);
    }

    return glass;
  }

  /**
   * Remove a windowless glass by id, unregistering it from the shared glass manager
   * and detaching it from `document.body`. Also removes its modal backdrop, if any.
   *
   * @param {string} windowlessGlassId - The id of the `bw-glass[windowless]` to remove
   * @returns {Element|null} - The removed element, or null if no glass had that id
   */
  static removeWindowlessGlass(windowlessGlassId) {
    const glassEl = document.getElementById(windowlessGlassId);

    // Unregister + animated removal (which also clears the modal backdrop).
    return detachedGlassManager.removeDetachedGlassByElement(glassEl);
  }
}

BinaryWindow.assemble(glassModule, detachedGlassModule, trimModule, sillModule, dragNewModule);

// Enable features that do not need a BinaryWindow instance
// e.g. handle pointer events
glassModule.enableGlassStandaloneFeatures();
// e.g. detached glass move/resize/activate
detachedGlassModule.enableDetachedGlassStandaloneFeatures();
