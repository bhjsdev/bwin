import { Frame } from '../frame/frame';
import glassModule, { Glass } from './glass';
import { createDomNode } from '../utils';
import trimModule from './trim';
import sillModule from './sill';
import detachedGlassModule from './detached-glass';
import { normActions } from './utils';
import { updateGlass } from './glass/utils';
import windowlessGlassStaticModule from './windowless-glass';

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
    if (!paneSash) return null;

    if (withGlass) {
      const glass = new Glass({ ...glassProps, sash: paneSash, binaryWindow: this });
      paneSash.domNode.append(glass.domNode);
    }
    return paneSash;
  }

  // TODO: support updating glass `actions` (rebuild the action bar/menu in place).
  updatePane(paneSashId, { position, size, minWidth, minHeight, title, content } = {}) {
    const sash = this.rootSash.getById(paneSashId);
    if (!sash) throw new Error(`[bwin] No sash found with id ${paneSashId} when updating pane`);

    if (position || size || minWidth || minHeight) {
      super.updatePane(paneSashId, { position, size, minWidth, minHeight });
    }

    if (title || content) {
      const glassEl = sash.domNode.querySelector('bw-glass');
      if (!glassEl)
        throw new Error(`[bwin] No glass found in pane with id ${paneSashId} when updating pane`);
      updateGlass(glassEl, { title, content });
    }
  }

  removePane(paneSashId) {
    super.removePane(paneSashId);

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
}

BinaryWindow.assemble(glassModule, detachedGlassModule, trimModule, sillModule);
BinaryWindow.assembleStatic(windowlessGlassStaticModule);

// Enable features that do not need a BinaryWindow instance
// RATIONAL: these attach document-global listeners at module load, so guard on
// `document` — importing the package during SSR (e.g. Next.js) has no DOM and
// would otherwise throw. Re-runs harmlessly once in the browser.
if (typeof document !== 'undefined') {
  // e.g. handle pointer events
  glassModule.enableGlassStandaloneFeatures();
  // e.g. detached glass move/resize/activate
  detachedGlassModule.enableDetachedGlassStandaloneFeatures();
}
