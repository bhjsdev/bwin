export default {
  enableObservers() {
    this.observeCloseButtons();
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

  observeCloseButtons() {
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
