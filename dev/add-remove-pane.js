import { Sash, Position, Frame, SashConfig } from '../src';

const settings = {
  width: 555,
  height: 333,
  children: [
    { position: 'left', size: 200, children: [0.4] },
    {
      position: 'right',
      children: [
        { position: 'top', size: '30%', children: [0.5] },
        {
          position: 'bottom',
          size: '70%',
          children: [
            {
              position: 'left',
              size: '70%',
              children: [
                { position: 'top', size: 0.6, children: [{ position: 'top', size: '40%' }] },
                { position: 'bottom' },
              ],
            },
            { position: 'right', size: '30%' },
          ],
        },
      ],
      id: 'my-right-horz-muntin',
    },
  ],
  id: 'my-root',
};

const frame = new Frame(settings);
frame.mount(document.querySelector('#container'));

document.querySelector('#add-pane').addEventListener('click', () => {
  const parentId = document.querySelector('#sash-id').value.trim();
  const position = document.querySelector('input[name="sash-position"]:checked').value;
  const size = parseFloat(document.querySelector('#sash-size').value);

  frame.addPane(parentId, { position, size });
});

document.querySelector('#remove-pane').addEventListener('click', () => {
  const sashId = document.querySelector('#sash-id').value.trim();
  frame.removePane(sashId);
});

window.rootSash = frame.rootSash;
