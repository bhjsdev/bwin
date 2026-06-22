import { Frame } from '../../src';

const lrFrame = new Frame({
  width: 600,
  height: 300,
  children: [
    { id: 'lr-a', position: 'left', size: 0.5, content: 'Left/right pane A (lr-a)' },
    { id: 'lr-b', content: 'Left/right pane B (lr-b)' },
  ],
});
lrFrame.mount(document.querySelector('#container-lr'));

const tbFrame = new Frame({
  width: 600,
  height: 300,
  children: [
    { id: 'tb-a', position: 'top', size: 0.5, content: 'Top/bottom pane A (tb-a)' },
    { id: 'tb-b', content: 'Top/bottom pane B (tb-b)' },
  ],
});
tbFrame.mount(document.querySelector('#container-tb'));

// Route a sash id to the frame that owns it.
function getFrameForSashId(id) {
  return lrFrame.rootSash.getById(id) ? lrFrame : tbFrame.rootSash.getById(id) ? tbFrame : null;
}

document.querySelector('#update-pane').addEventListener('click', () => {
  const id = document.querySelector('#sash-id').value.trim();
  const position = document.querySelector('input[name="sash-position"]:checked').value;
  const size = document.querySelector('#size').value.trim();
  const minWidth = document.querySelector('#min-width').value.trim();
  const minHeight = document.querySelector('#min-height').value.trim();

  const frame = getFrameForSashId(id);
  if (!frame) {
    console.warn(`[update-pane] No pane found with id "${id}"`);
    return;
  }

  // Only pass fields the user actually filled in.
  const props = {};
  if (position) props.position = position;
  if (size) props.size = size;
  if (minWidth) props.minWidth = Number(minWidth);
  if (minHeight) props.minHeight = Number(minHeight);

  frame.updatePane(id, props);
});

window.lrFrame = lrFrame;
window.tbFrame = tbFrame;
