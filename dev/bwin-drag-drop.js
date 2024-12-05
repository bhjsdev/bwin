import { BinaryWindow } from '../src';

const dragItem = document.getElementById('draggable');

let canDrag = false;

document.addEventListener('dragstart', (event) => {
  canDrag = event.target === dragItem;
});

function handleDrop(event, sash) {
  if (!canDrag) return;

  const paneEl = sash.domNode;
  paneEl.append(dragItem);
  const dropArea = paneEl.getAttribute('drop-area');
  dragItem.style.position = 'absolute';

  if (dropArea === 'top') {
    dragItem.style.top = '0';
    dragItem.style.left = '50%';
    dragItem.style.transform = 'translateX(-50%)';
  }
  else if (dropArea === 'right') {
    dragItem.style.top = '50%';
    dragItem.style.left = 'auto';
    dragItem.style.right = '0';
    dragItem.style.transform = 'translateY(-50%)';
  }
  else if (dropArea === 'bottom') {
    dragItem.style.top = 'auto';
    dragItem.style.bottom = '0';
    dragItem.style.left = '50%';
    dragItem.style.transform = 'translateX(-50%)';
  }
  else if (dropArea === 'left') {
    dragItem.style.top = '50%';
    dragItem.style.left = '0';
    dragItem.style.transform = 'translateY(-50%)';
  }
  else if (dropArea === 'center') {
    dragItem.style.top = '50%';
    dragItem.style.left = '50%';
    dragItem.style.transform = 'translate(-50%, -50%)';
  }
}

const settings = {
  children: [
    { size: 0.5, onDrop: handleDrop, draggable: false, title: 'no drag' },
    { onDrop: handleDrop },
  ],
};

const win = new BinaryWindow(settings);
win.debug = false;
win.mount(document.querySelector('#container'));
