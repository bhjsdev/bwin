import { describe, it, expect, beforeEach } from 'vitest';
import { BinaryWindow } from './binary-window';

// `store` is the single source of truth for glass content. These cover the moves that
// historically read the DOM instead — swap, edge-split drop, and detach/attach.
describe('sash.store single source of truth', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    Object.defineProperty(container, 'getBoundingClientRect', {
      value: () => ({ width: 800, height: 600, left: 0, top: 0, right: 800, bottom: 600 }),
    });
    document.body.append(container);
  });

  function mountTwoPanes(extraA = {}) {
    const win = new BinaryWindow({
      width: 800,
      height: 600,
      children: [
        { id: 'A', size: '50%', title: 'Title A', content: '<p>Content A</p>', ...extraA },
        { id: 'B', size: '50%', title: 'Title B', content: '<p>Content B</p>' },
      ],
    });
    win.mount(container);
    return win;
  }

  const titleOf = (win, sashId) =>
    win.windowElement.querySelector(`[sash-id="${sashId}"] bw-glass-title`)?.textContent;
  const contentOf = (win, sashId) =>
    win.windowElement.querySelector(`[sash-id="${sashId}"] bw-glass-content`)?.textContent;

  it('swap: store and DOM stay in sync', () => {
    const win = mountTwoPanes();
    const paneA = win.windowElement.querySelector('[sash-id="A"]');
    const paneB = win.windowElement.querySelector('[sash-id="B"]');

    win.activeDropPaneEl = paneB;
    win.swapPanes(paneA, paneB);

    // Sash A now shows B's content, and its store agrees with the DOM.
    expect(titleOf(win, 'A')).toBe('Title B');
    expect(titleOf(win, 'B')).toBe('Title A');
    const sashA = win.rootSash.getById('A');
    expect(sashA.store.title).toBe(win.windowElement.querySelector('[sash-id="A"] bw-glass-title'));
  });

  it('swap: preserves live content nodes (not a rebuild)', () => {
    const win = mountTwoPanes();
    const paneA = win.windowElement.querySelector('[sash-id="A"]');
    const paneB = win.windowElement.querySelector('[sash-id="B"]');

    // Mark the live node inside pane A's content; a real move keeps the same node.
    const input = document.createElement('input');
    paneA.querySelector('bw-glass-content').append(input);
    input.value = 'typed-but-unsaved';

    win.activeDropPaneEl = paneB;
    win.swapPanes(paneA, paneB);

    // The marked node (and its uncommitted value) followed the content to sash B's pane.
    const movedInput = win.windowElement.querySelector('[sash-id="B"] bw-glass-content input');
    expect(movedInput).toBe(input);
    expect(movedInput.value).toBe('typed-but-unsaved');
  });

  it('edge-split drop then detach shows the dragged glass content', () => {
    const win = mountTwoPanes();
    const paneA = win.windowElement.querySelector('[sash-id="A"]');
    const paneB = win.windowElement.querySelector('[sash-id="B"]');

    // Arm the drag of glass A, then drop on pane B's right edge via the real handler.
    paneA
      .querySelector('bw-glass-header')
      .dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    win.activeDropPaneEl = paneB;
    paneB.setAttribute('drop-area', 'right');
    win.onPaneDrop(new Event('drop'), win.rootSash.getById('B'));

    // The relocated pane holds exactly one glass with A's content.
    const relocated = win.windowElement.querySelector('[sash-id="A"]');
    expect(relocated.querySelectorAll('bw-glass').length).toBe(1);

    relocated
      .querySelector('.bw-glass-action--detach')
      .dispatchEvent(new Event('click', { bubbles: true }));

    const detached = win.windowElement.querySelector('bw-glass[detached]');
    expect(detached).toBeTruthy();
    expect(detached.querySelector('bw-glass-title').textContent).toBe('Title A');
    expect(detached.querySelector('bw-glass-content').textContent).toContain('Content A');
  });

  it('detach then attach keeps tabs and content', () => {
    const win = mountTwoPanes({ title: undefined, tabs: ['One', 'Two'] });
    const paneA = win.windowElement.querySelector('[sash-id="A"]');
    expect(paneA.querySelectorAll('.bw-glass-tab').length).toBe(2);

    paneA
      .querySelector('.bw-glass-action--detach')
      .dispatchEvent(new Event('click', { bubbles: true }));
    win.windowElement
      .querySelector('bw-glass[detached] .bw-glass-action--attach')
      .dispatchEvent(new Event('click', { bubbles: true }));

    // Tabs and content survive the round-trip (previously dropped to 0 tabs).
    expect(win.windowElement.querySelectorAll('.bw-glass-tab').length).toBe(2);
    expect(win.windowElement.querySelector('bw-pane bw-glass-content').textContent).toContain(
      'Content A'
    );
  });
});
