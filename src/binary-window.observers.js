import { CLOSE_BUTTON_CLASSNAME } from './glass.actions';

export default {
  enableObservers() {
    this.observeCloseButtons();
  },

  toggleCloseButtonsDisabledState() {
    const cssSelector = `.${CLOSE_BUTTON_CLASSNAME}`;
    const paneCount = this.windowElement.querySelectorAll('bw-pane').length;

    if (paneCount === 1) {
      const closeButtonEl = this.windowElement.querySelector(cssSelector);
      closeButtonEl && closeButtonEl.setAttribute('disabled', '');
    }
    else {
      this.windowElement.querySelectorAll(cssSelector).forEach((closeButtonEl) => {
        closeButtonEl.removeAttribute('disabled');
      });
    }
  },

  observeCloseButtons() {
    this.toggleCloseButtonsDisabledState();

    const paneCountObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.toggleCloseButtonsDisabledState();
        }
      });
    });

    paneCountObserver.observe(this.windowElement, {
      childList: true,
    });
  },
};
