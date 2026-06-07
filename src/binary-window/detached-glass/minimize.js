import { createDomNode } from '@/utils';
import { detachedGlassManager } from './manager';

export const minimizeAction = {
  label: '',
  className: 'bw-glass-action--minimize',
  onClick: (event, binaryWindow) => {
    const sillEl = binaryWindow.sillElement;
    if (!sillEl) throw new Error(`[bwin] Sill element not found when minimizing`);

    const minimizedDetachedGlassEl = createDomNode('<button class="bw-minimized-detached-glass" />');
    sillEl.append(minimizedDetachedGlassEl);

    const detachedGlassEl = event.target.closest('bw-glass[detached]');
    if (!detachedGlassEl) throw new Error(`[bwin] Detached Glass element not found when minimizing`);

    minimizedDetachedGlassEl.bwDetachedGlassElement = detachedGlassEl;
    detachedGlassEl.style.display = 'none';
  },
};

