import { BinaryWindow, BUILTIN_ACTIONS } from '../../src';

const updateAction = {
  label: 'Update',
  onClick: (event) => {
    const buttonEl = event.target;
    const headerEl = buttonEl.closest('bw-glass-header');
    headerEl.style.backgroundColor = 'lightblue';

    const contentEl = buttonEl.closest('bw-glass').querySelector('bw-glass-content');
    contentEl.innerHTML = 'Content updated!';
  },
};

const dropdownActions = [
  {
    label: 'Action 1',
    placement: 'menu',
    onClick: () => {
      alert('Action 1 clicked');
    },
  },
  {
    label: 'Dummy action',
    placement: 'menu',
    onClick: () => {
      alert('Dummy action clicked');
    },
  },
  {
    label: 'Dummy action 2',
    placement: 'menu',
    onClick: () => {
      alert('Dummy action 2 clicked');
    },
  },
];

const settings = {
  width: 666,
  height: 333,
  children: [
    {
      position: 'left',
      size: '45%',
      id: 'my-left-pane',
    },
    {
      children: [
        {
          position: 'top',
          actions: [updateAction, ...dropdownActions, ...BUILTIN_ACTIONS, 'XXX'],
        },
        {
          actions: [
            {
              label: 'A 10',
              placement: 'menu',
              onClick: () => {
                alert('Another action clicked');
              },
            },
          ],
        },
      ],
    },
  ],
  id: 'my-root',
};

const win = new BinaryWindow(settings);
win.mount(document.querySelector('#container'));
