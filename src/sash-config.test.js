import { expect, test } from 'vitest';
import { SashConfig } from './sash-config';
import { FEAT_DEFAULTS } from './config-root';

test('Instantiate', () => {
  const config = new SashConfig();

  expect(config.resizable).toBe(FEAT_DEFAULTS.resizable);
  expect(config.fitContainer).toBe(FEAT_DEFAULTS.fitContainer);
});
