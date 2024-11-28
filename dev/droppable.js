import { Frame } from '../src';

function handleDrop(sash) {
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
    { size: 100, droppable: false, id: 'droppable-pane', onDrop: handleDrop },
    { droppable: true, onDrop: handleDrop },
  ],
};

const frame = new Frame(settings);
frame.mount(document.querySelector('#container'));

const dragItem = document.getElementById('draggable');
const dropZone = document.getElementById('dropzone');

// Drag events
dragItem.addEventListener('dragstart', (event) => {
  dragItem.style.opacity = '0.5';
});

dragItem.addEventListener('dragend', () => {
  dragItem.style.opacity = '1';
});

// Drop events
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault(); // Required to allow drop
  dropZone.classList.add('highlight');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('highlight');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  console.log('🐞 -> dragItem:', dragItem);

  dropZone.classList.remove('highlight');

  dragItem.style.position = 'static';
  dragItem.style.transform = 'none';
  dropZone.appendChild(dragItem);
});

const droppablePaneEl = document.querySelector('[sash-id="droppable-pane"]');
let droppable = droppablePaneEl.getAttribute('can-drop') !== 'false';

document.querySelector('#toggle-droppable').addEventListener('click', (event) => {
  droppable = !droppable;
  event.target.textContent = droppable
    ? 'Disable droppable on left pane'
    : 'Enable droppable on left pane';
  droppablePaneEl.setAttribute('can-drop', droppable);
});

window.frame = frame;
