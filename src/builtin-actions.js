import { getSashIdFromPane } from './frame.utils';

export const CLOSE_BUTTON_CLASSNAME = 'bw-glass-action--close';
export const EXPAND_BUTTON_CLASSNAME = 'bw-glass-action--expand';
export const MINIMIZE_BUTTON_CLASSNAME = 'bw-glass-action--minimize';

export const BUILTIN_ACTIONS = [
  {
    label: '',
    className: MINIMIZE_BUTTON_CLASSNAME,
    onClick: (event, binaryWindow) => {},
  },
  {
    label: '',
    className: EXPAND_BUTTON_CLASSNAME,
    onClick: (event, binaryWindow) => {},
  },
  {
    label: '',
    className: CLOSE_BUTTON_CLASSNAME,
    onClick: (event, binaryWindow) => {
      const sashId = getSashIdFromPane(event.target);
      binaryWindow.removePane(sashId);
    },
  },
];
