import { getSashIdFromPane } from './frame.utils.js';

export default {
  enableClose() {
    this.windowElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('bw-glass-action--close')) {
        const sashId = getSashIdFromPane(event.target);
        this.removePane(sashId);
      }
    });
  },
};
