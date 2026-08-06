import { addWindowlessGlass } from '../../src';

const createContent = (label) => `<div style="padding:8px;font-family:sans-serif">${label}</div>`;

// Static method: floats on document.body, not inside any bw-window.
document.querySelector('#add-windowless').addEventListener('click', () => {
  addWindowlessGlass({
    title: 'Windowless glass',
    content: createContent('windowless'),
  });
});

// Modal: a backdrop is appended behind the glass to block everything underneath.
document.querySelector('#add-modal').addEventListener('click', () => {
  addWindowlessGlass({
    modal: true,
    title: 'Modal windowless glass',
    content: createContent('modal'),
  });
});

// Modal that dismisses itself when the backdrop (not the glass) is clicked.
document.querySelector('#add-modal-close-on-backdrop').addEventListener('click', () => {
  addWindowlessGlass({
    modal: true,
    closeOnBackdropClick: true,
    title: 'Modal (click backdrop to close)',
    content: createContent('click outside me'),
  });
});

// Placed relative to the body's top-left via offsetX/offsetY.
document.querySelector('#add-positioned').addEventListener('click', () => {
  addWindowlessGlass({
    title: 'Positioned windowless glass',
    position: 'top-left',
    offsetX: 120,
    offsetY: 80,
    content: createContent('positioned'),
  });
});

// Windowless glass filling the viewport with a 20px inset on every edge.
// A fullscreen popup shouldn't be resized, so `resizable: false` suppresses the handles.
document.querySelector('#add-fullscreen').addEventListener('click', () => {
  const EDGE = 20;
  addWindowlessGlass({
    title: 'Fullscreen popup',
    draggable: false,
    resizable: false,
    position: 'top-left',
    offset: EDGE,
    width: document.documentElement.clientWidth - EDGE * 2,
    height: document.documentElement.clientHeight - EDGE * 2,
    content: createContent('fullscreen'),
    modal: true,
  });
});

// `resizable: false` keeps resize handles from ever appearing on hover.
document.querySelector('#add-non-resizable').addEventListener('click', () => {
  addWindowlessGlass({
    title: 'Non-resizable glass',
    resizable: false,
    content: createContent('non-resizable'),
  });
});
