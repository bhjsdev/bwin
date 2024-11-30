const draggableContainer = document.querySelector('#draggable-container');

document.querySelector('#toggle-draggable').addEventListener('click', (event) => {
  draggableContainer.setAttribute(
    'draggable',
    draggableContainer.getAttribute('draggable') === 'true' ? 'false' : 'true'
  );
});

document.querySelector('#dropzone').addEventListener('dragover', (event) => {
  console.log('dragover');
  event.preventDefault();
});
