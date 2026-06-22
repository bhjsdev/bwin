const el = document.querySelector('#draggable-item');

document.querySelector('#toggle-draggable').addEventListener('click', (event) => {
  el.setAttribute('draggable', el.getAttribute('draggable') === 'true' ? 'false' : 'true');
});

document.querySelector('#dropzone').addEventListener('dragover', (event) => {
  console.log('dragover');
  event.preventDefault();
});
