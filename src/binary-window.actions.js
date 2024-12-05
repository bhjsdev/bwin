import closeAction from './binary-window.actions.close';
import minimizeAction from './binary-window.actions.minimize';
import maximizeAction from './binary-window.actions.maximize';

export const BUILTIN_ACTIONS = [minimizeAction, maximizeAction, closeAction];

export default {
  enableActions() {
    this.handleMinimizedGlassClick();
    this.observeActionButtons();
  },

  handleMinimizedGlassClick() {
    this.sillElement.addEventListener('click', (event) => {
      if (!event.target.matches('.bw-minimized-glass')) return;

      const minimizedGlassEl = event.target;
      const prevSiblingSash = this.rootSash.getById(minimizedGlassEl.bwPrevSiblingSashId);

      if (prevSiblingSash && prevSiblingSash.children.length === 0) {
        const newPaneSash = this.addPane(
          minimizedGlassEl.bwPrevSiblingSashId,
          minimizedGlassEl.bwPrevSelfPosition
        );

        newPaneSash.domNode.append(minimizedGlassEl.bwGlassElement);
      }
      else {
        // Add the glass to a random pane. To be improved
        const randomPaneEl = this.windowElement.querySelector('bw-pane');
        const randomPaneSashId = randomPaneEl.getAttribute('sash-id');
        const newSashPane = this.addPane(randomPaneSashId, 'right');

        newSashPane.domNode.append(minimizedGlassEl.bwGlassElement);
      }

      minimizedGlassEl.remove();
    });
  },

  updateDisabledStateOfActionButtons() {
    this.updateDisabledState('.bw-glass-action--close');
    this.updateDisabledState('.bw-glass-action--minimize');
    this.updateDisabledState('.bw-glass-action--maximize');
  },

  updateDisabledState(cssSelector) {
    const paneCount = this.windowElement.querySelectorAll('bw-pane').length;

    if (paneCount === 1) {
      const el = this.windowElement.querySelector(cssSelector);
      el && el.setAttribute('disabled', '');
    }
    else {
      this.windowElement.querySelectorAll(cssSelector).forEach((el) => {
        el.removeAttribute('disabled');
      });
    }
  },

  observeActionButtons() {
    this.updateDisabledStateOfActionButtons();

    const paneCountObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.updateDisabledStateOfActionButtons();
        }
      });
    });

    paneCountObserver.observe(this.windowElement, {
      childList: true,
    });
  },
};
