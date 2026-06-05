import { createFloatPaneElement } from './float-pane-utils.js';
import { floatPaneManager } from './float-pane-manager.js';
import { Glass } from './glass.js';

export default {
  addFloatPane(props = {}) {
    const {
      position = 'top-right',
      width = 200,
      height = 200,
      offset = -20,
      id,
      ...glassProps
    } = props;

    const glass = new Glass({ ...glassProps, binaryWindow: this });
    const floatPaneEl = createFloatPaneElement({ position, width, height, offset, id });

    floatPaneEl.append(glass.domNode);
    floatPaneManager.add(floatPaneEl);

    return floatPaneEl;
  },
};
