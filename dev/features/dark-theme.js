import { BinaryWindow } from '../../src';

const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.`;

// Native form elements to verify `color-scheme: dark` is applied.
const inputs = `
  <form>
    <input type="text" placeholder="Text input" />
    <input type="search" placeholder="Search input" />
    <input type="number" value="42" />
    <input type="date" />
    <input type="range" />
    <select>
      <option>Option 1</option>
      <option>Option 2</option>
    </select>
    <textarea placeholder="Textarea"></textarea>
    <label><input type="checkbox" checked /> Checkbox</label>
    <label><input type="radio" name="r" checked /> Radio</label>
    <progress value="0.5"></progress>
    <button type="button">Button</button>
  </form>
`;

const settings = {
  theme: 'dark',
  width: 444,
  height: 333,
  children: [
    { position: 'left', size: '40%', content },
    {
      children: [
        { position: 'top', size: '30%', content },
        { position: 'bottom', size: '70%', content: inputs },
      ],
    },
  ],
};

const bwin = new BinaryWindow(settings);
bwin.mount(document.querySelector('#container'));

document.querySelector('#toggle-theme').addEventListener('click', () => {
  const isDark = bwin.windowElement.getAttribute('theme') === 'dark';
  bwin.windowElement.setAttribute('theme', isDark ? 'light' : 'dark');
});

document.querySelector('#set-theme-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const theme = document.querySelector('#theme-input').value.trim();
  bwin.setTheme(theme);
});
