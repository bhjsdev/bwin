import { createFloatPaneElement } from "./float-pane-utils.js";
import { floatPaneManager } from "./float-pane-manager.js";

export default {
  createFloatPane() {
    const floatPaneEl = createFloatPaneElement();
    floatPaneManager.add(floatPaneEl);
    return floatPaneEl;
  },
};
