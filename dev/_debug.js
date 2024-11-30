const draggableContainer = document.querySelector('#draggable-container');

// document.querySelector('#toggle-draggable').addEventListener('click', (event) => {
//   draggableContainer.setAttribute(
//     'draggable',
//     draggableContainer.getAttribute('draggable') === 'true' ? 'false' : 'true'
//   );
// });

document.addEventListener(
  'dragstart',
  (event) => {
    console.log('drag start', event.target, event.currentTarget);

    if (!event.target.matches('#draggable-container')) {
      event.preventDefault();
    }
  },
  true
);

document.querySelector('#dropzone').addEventListener('dragover', (event) => {
  // event.preventDefault();
  console.log('dragover');
});
