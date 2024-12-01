const draggableContainer = document.querySelector('#draggable-container');

document.querySelector('#toggle-draggable').addEventListener('click', (event) => {
  draggableContainer.setAttribute(
    'draggable',
    draggableContainer.getAttribute('draggable') === 'true' ? 'false' : 'true'
  );
});

document.addEventListener('dragstart', (event) => {
  if (
    event.target.matches('#draggable-container') &&
    event.target.getAttribute('draggable') === 'false'
  ) {
    event.preventDefault();
  }
});

document.addEventListener('mousedown', (event) => {
  if (
    !event.target.matches('#draggable-container') &&
    event.target.closest('#draggable-container')
  ) {
    console.log('found draggable container');
    event.preventDefault();
  }
});

document.addEventListener('click', (event) => {
  if (event.target.matches('#button')) {
    console.log('click on button');
  }
});

document.querySelector('#dropzone').addEventListener('dragover', (event) => {
  event.preventDefault();
  console.log('dragover 1');
});
