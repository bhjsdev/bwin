/**
 * Generate a random color string in the format of "rgba(r, g, b, a)"
 *
 * @param {number} maxOpacity - The maximum opacity value (0 to 1)
 * @returns {string}
 */
export function genColor(maxOpacity = 0.5) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const opacity = Math.random() * maxOpacity;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Generate a random string of digits
 *
 * @param {number} length - The length of the string
 * @returns {string}
 */
export function genDigits(length = 5) {
  if (length <= 0 || !Number.isInteger(length)) {
    throw new Error('Parameter must be a positive integer');
  }

  const max = Math.pow(10, length);
  const num = Math.floor(Math.random() * max);
  return num.toString().padStart(length, '0');
}

/**
 * Generate a random ID in the format of "AB-123"
 *
 * @param {number} alphabetLength - The length of the alphabet part
 * @param {number} digitLength - The length of the digit part
 * @returns {string}
 */
export function genId(alphabetLength = 2, digitLength = 3) {
  if (alphabetLength < 0 || digitLength < 0) {
    throw new Error('Parameters must be non-negative numbers');
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';

  let result = '';
  for (let i = 0; i < alphabetLength; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    result += alphabet[randomIndex];
  }

  result += '-';

  for (let i = 0; i < digitLength; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    result += digits[randomIndex];
  }

  return result;
}

/**
 * Move all child nodes from one DOM element to another
 *
 * @param {HTMLElement} toNode - The destination node
 * @param {HTMLElement} fromNode - The source node
 */
export function moveChildNodes(toNode, fromNode) {
  while (fromNode.firstChild) {
    toNode.append(fromNode.firstChild);
  }
}

/**
 * Parse a size string into a number, e.g. "100px" -> 100, "50%" -> 0.5
 *
 * @param {string | number} size - The size string to parse
 * @returns {number}
 */
export function parseSize(size) {
  if (typeof size === 'number' && !isNaN(size)) {
    return size;
  }

  if (typeof size === 'string') {
    const trimmed = size.trim();

    if (trimmed.endsWith('%')) {
      const withoutPercent = trimmed.slice(0, -1);
      if (!withoutPercent) return NaN;
      const number = Number(withoutPercent);
      return !isNaN(number) ? number / 100 : NaN;
    }

    if (trimmed.endsWith('px')) {
      const withoutPx = trimmed.slice(0, -2);
      if (!withoutPx) return NaN;
      const number = Number(withoutPx);
      return !isNaN(number) ? number : NaN;
    }

    return Number(trimmed);
  }

  return NaN;
}
