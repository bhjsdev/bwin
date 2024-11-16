import { Frame } from '../src';
import { createFragment } from '../src/utils';

const el1 = createFragment('<p>Left Pane</p>');

const settings = {
  width: 333,
  height: 222,
  children: [
    { position: 'left', size: '40%', id: 'my-left-pane', content: el1 },
    {
      position: 'right',
      size: '60%',
      children: [
        {
          position: 'top',
          size: '30%',
          id: 'my-right-top-pane',
          content: '<mark>top right</mark>',
        },
        { position: 'bottom', size: '70%', id: 'my-right-bottom-pane', content: NaN },
      ],
      id: 'my-right-horz-muntin',
    },
  ],
  id: 'my-root',
};

const frame = new Frame(document.querySelector('#container'), settings);
frame.debug = false;
frame.init();

window.sash = frame.rootSash;
