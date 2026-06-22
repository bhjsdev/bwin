import { BinaryWindow } from '../../src';

const settings = {
  width: 444,
  height: 333,
  children: [
    { position: 'left', size: '40%', id: 'a', title: 'a', content: 'Pane a' },
    {
      children: [
        { position: 'top', size: '30%', id: 'b', title: 'b', content: 'Pane b' },
        { position: 'bottom', size: '70%', id: 'c', title: 'c', content: 'Pane c' },
      ],
    },
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

document.querySelector('#update-pane').addEventListener('click', () => {
  const id = document.querySelector('#sash-id').value.trim();
  const position = document.querySelector('input[name="sash-position"]:checked').value;
  const size = document.querySelector('#size').value.trim();
  const title = document.querySelector('#title').value;
  const content = document.querySelector('#content').value;

  // Only pass fields the user actually filled in.
  const props = { id };
  if (position) props.position = position;
  if (size) props.size = size;
  if (title) props.title = title;
  if (content) props.content = content;

  bwin.updatePane(props);
});

window.bwin = bwin;
