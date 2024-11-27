import { CLOSE_BUTTON_CLASSNAME } from './glass.actions';

export default {
  enableObservers() {
    this.observeCloseButtons();
  },

  observeCloseButtons() {
    const cssSelector = `.${CLOSE_BUTTON_CLASSNAME}`;

    const paneCountObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
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
        }
      });
    });

    paneCountObserver.observe(this.windowElement, {
      childList: true,
    });
  },
};
