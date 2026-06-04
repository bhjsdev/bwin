import floatPane from "./float-pane";

  export function createFloatPaneElement() {
    const floatPaneEl = document.createElement('bw-float-pane');
    floatPaneEl.style.position = 'absolute';
    floatPaneEl.style.top = '20px';
    floatPaneEl.style.right = '20px';
    floatPaneEl.style.width = '200px';
    floatPaneEl.style.height = '250px';
    floatPaneEl.style.backgroundColor = 'pink';
    floatPaneEl.style.opacity = '0.95';

    floatPaneEl.setAttribute('active', 'true');

    return floatPaneEl;
  }