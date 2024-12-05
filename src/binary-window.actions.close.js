import { getSashIdFromPane } from './frame.utils';

export default {
  label: '',
  className: 'bw-glass-action--close',
  onClick: (event, binaryWindow) => {
    const sashId = getSashIdFromPane(event.target);
    binaryWindow.removePane(sashId);
  },
};
