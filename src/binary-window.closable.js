import { getSashIdFromPane } from './frame.utils.js';

export default {
  enableClose() {
    const closeButtonSelector = '.bw-glass-action--close';

    this.windowElement.addEventListener('click', (event) => {
      if (event.target.matches(closeButtonSelector)) {
        const sashId = getSashIdFromPane(event.target);
        this.removePane(sashId);
      }
    });

    const paneCountObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const paneCount = this.windowElement.querySelectorAll('bw-pane').length;

          if (paneCount === 1) {
            const closeButtonEl = this.windowElement.querySelector(closeButtonSelector);
            closeButtonEl && closeButtonEl.setAttribute('disabled', '');
          }
          else {
            this.windowElement.querySelectorAll(closeButtonSelector).forEach((closeButtonEl) => {
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
