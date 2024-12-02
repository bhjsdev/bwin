import { getSashIdFromPane } from './frame.utils';

export const CLOSE_BUTTON_CLASSNAME = 'bw-glass-action--close';

export const BUILTIN_ACTIONS = [
  {
    label: '',
    className: CLOSE_BUTTON_CLASSNAME,
    onClick: (event, binaryWindow) => {
      const sashId = getSashIdFromPane(event.target);
      binaryWindow.removePane(sashId);
    },
  },
];
