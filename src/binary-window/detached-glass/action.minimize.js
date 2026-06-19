import { createDomNode } from '@/utils';

export default {
  type: 'detached-glass-builtin',
  placement: 'bar',
  label: '',
  className: 'bw-action--minimize',
  onClick: (event, binaryWindow) => {
    const sillEl = binaryWindow.sillElement;
    if (!sillEl) throw new Error(`[bwin] Sill element not found when minimizing`);

    const potEl = createDomNode('<button class="bw-pot" bw-plant="detached-glass" />');
    sillEl.append(potEl);

    const detachedGlassEl = event.target.closest('bw-glass[detached]');
    if (!detachedGlassEl)
      throw new Error(`[bwin] Detached Glass element not found when minimizing`);

    potEl.bwDetachedGlassElement = detachedGlassEl;
    detachedGlassEl.style.display = 'none';
  },
};
