import { getSashIdFromPane } from '@/frame/frame-utils';

export default {
  type: 'glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--close',
  onClick: (event, binaryWindow) => {
    const sashId = getSashIdFromPane(event.target);
    const glassEl = binaryWindow.rootSash.getById(sashId).domNode.querySelector('bw-glass');

    binaryWindow.removePane(sashId);
    binaryWindow.emit('close', glassEl);
  },
};
