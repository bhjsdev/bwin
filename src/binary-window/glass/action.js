export default {
  enableGlassActions() {
    this.observeActionButtons();
    this.dismissActionMenuOnPointerDown();
  },

  // Dismiss the open action menu when pressing elsewhere (dragging muntins,
  // glass headers, etc). Pointerdowns on the trigger or inside the menu are left
  // alone so the popover's own toggle/light-dismiss handles them.
  dismissActionMenuOnPointerDown() {
    this.windowElement.addEventListener('pointerdown', (event) => {
      if (event.target.closest('.bw-action-menu-trigger, bw-action-menu')) return;

      this.windowElement
        .querySelectorAll('bw-action-menu:popover-open')
        .forEach((menuEl) => menuEl.hidePopover());
    });
  },

  updateDisabledStateOfActionButtons() {
    this.updateDisabledState('.bw-action--close');
    this.updateDisabledState('.bw-action--minimize');
    this.updateDisabledState('.bw-action--maximize');
    this.updateDisabledState('.bw-action--detach');
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

  // Re-sync action button disabled state whenever panes are added/removed,
  // so the last remaining pane can't be closed/minimized/maximized.
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
