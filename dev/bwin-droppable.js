import { BinaryWindow } from '../src';

const settings = {
  children: [100],
  onDrop: (event, sash) => {
    const paneEl = event.target;
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
  },
};

const dragItem = document.getElementById('draggable');

const bwin = new BinaryWindow(document.querySelector('#container'), settings);
bwin.create();
