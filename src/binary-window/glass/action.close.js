import { getSashIdFromPane } from '@/frame/frame-utils';

export default {
  type: 'glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--close',
  onClick: (event, binaryWindow) => {
    const sashId = getSashIdFromPane(event.target);
    binaryWindow.removePane(sashId);
  },
};
