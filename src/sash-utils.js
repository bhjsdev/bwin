import { isPlainObject } from './utils';

export function isSashLike(object) {
  return (
    isPlainObject(object) &&
    'top' in object &&
    'left' in object &&
    'width' in object &&
    'height' in object &&
    'position' in object
  );
}
