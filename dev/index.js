import './index.css';

const files = ['layout-only', 'resize-x', 'resize-y', 'fit-container'].sort();

const navEl = document.createElement('nav');

navEl.innerHTML = `
  <menu class="_menu">
    <li><a href="/debug.html">Debug</a></li>
    ${files.map((file) => `<li><a href="/${file}.html">${file}</a></li>`).join('')}
  </menu>
`;

document.body.prepend(navEl);
