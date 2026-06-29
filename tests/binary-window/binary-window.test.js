import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BinaryWindow } from '@/binary-window/binary-window';

describe('BinaryWindow#updatePane', () => {
  let containerEl;
  let bwin;

  beforeEach(() => {
    containerEl = document.createElement('div');
    document.body.append(containerEl);

    bwin = new BinaryWindow({
      width: 444,
      height: 333,
      children: [
        { position: 'left', size: '40%', id: 'a', title: 'a', content: 'Pane a' },
        { position: 'right', size: '60%', id: 'b', title: 'b', content: 'Pane b' },
      ],
    });
    bwin.mount(containerEl);
  });

  afterEach(() => {
    containerEl.remove();
  });

  function getPaneEl(sashId) {
    return bwin.windowElement.querySelector(`[sash-id="${sashId}"]`);
  }

  it('takes the pane sash id as the first positional argument', () => {
    bwin.updatePane('a', { title: 'updated a', content: 'updated content a' });

    const titleEl = getPaneEl('a').querySelector('bw-glass-title');
    const contentEl = getPaneEl('a').querySelector('bw-glass-content');

    expect(titleEl.textContent).toBe('updated a');
    expect(contentEl.textContent).toBe('updated content a');
  });

  it('updates only the targeted pane, leaving siblings untouched', () => {
    bwin.updatePane('a', { title: 'updated a' });

    expect(getPaneEl('a').querySelector('bw-glass-title').textContent).toBe('updated a');
    expect(getPaneEl('b').querySelector('bw-glass-title').textContent).toBe('b');
  });

  it('updates the pane size via the layout path', () => {
    bwin.updatePane('a', { size: '20%' });

    // The split is horizontal (left/right), so size maps to width.
    const sashA = bwin.rootSash.getById('a');
    const sashB = bwin.rootSash.getById('b');
    expect(sashA.width).toBeLessThan(sashB.width);
  });

  it('throws when no sash matches the given id', () => {
    expect(() => bwin.updatePane('nope', { title: 'x' })).toThrow(
      '[bwin] No sash found with id nope when updating pane'
    );
  });

  it('does not require an options object', () => {
    expect(() => bwin.updatePane('a')).not.toThrow();
  });
});
