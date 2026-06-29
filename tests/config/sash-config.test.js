import { expect, test } from 'vitest';
import { SashConfig } from '@/config/sash-config';
import { FEAT_DEFAULTS } from '@/config/config-root';

test('Instantiate', () => {
  const config = new SashConfig();

  expect(config.fitContainer).toBe(FEAT_DEFAULTS.fitContainer);
});
