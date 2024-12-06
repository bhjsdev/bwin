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
 * Generate a bright random color string in the format of "rgba(r, g, b, a)"
 *
 * @param {number} maxOpacity - The maximum opacity value (0.5 to 1)
 * @returns {string}
 */
export function genBrightColor(maxOpacity = 0.7, minBrightness = 128) {
  const brightnessRange = 256 - minBrightness;

  const r = Math.floor(Math.random() * brightnessRange + minBrightness);
  const g = Math.floor(Math.random() * brightnessRange + minBrightness);
  const b = Math.floor(Math.random() * brightnessRange + minBrightness);
  const opacity = Math.max(0.5, Math.random() * maxOpacity);

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
 * @returns {string} - The generated ID
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
 * @param {Node} toNode - The destination node
 * @param {Node} fromNode - The source node
 */
export function moveChildNodes(toNode, fromNode) {
  while (fromNode.firstChild) {
    toNode.append(fromNode.firstChild);
  }
}

/**
 * Swap two DOM nodes' child nodes
 *
 * @param {Node} parentNode1 - The parent node
 * @param {Node} parentNode2 - Another parent node
 */
export function swapChildNodes(parentNode1, parentNode2) {
  const tempNode = document.createElement('div');

  moveChildNodes(tempNode, parentNode1);
  moveChildNodes(parentNode1, parentNode2);
  moveChildNodes(parentNode2, tempNode);
}

/**
 * Parse a size string into a number, e.g. "100px" to 100, "50%" to 0.5
 *
 * @param {string | number} size - The size string to parse
 * @returns {number} - The parsed size, e.g. 100 for "100px", 0.5 for "50%"
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

/**
 * Check if a value is a plain object, not array, null, etc
 *
 * @param {*} value - The value to check
 * @returns {boolean}
 */
export function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Assign properties from source object if they don't already exist in target object
 *
 * @param {object} target - The target object
 * @param {object} source - The source object
 */
export function strictAssign(target, source) {
  for (const key in source) {
    if (Object.hasOwn(target, key)) {
      throw new Error(`Key "${key}" already exists in target object`);
    }
    target[key] = source[key];
  }
  return target;
}

/**
 * Throttle a function to run at most once every `limit` milliseconds
 *
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 */
export function throttle(func, limit) {
  let inThrottle = false;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Create a DocumentFragment from an HTML string
 *
 * @param {string} htmlString - The HTML string
 * @returns {DocumentFragment}
 */
export function createFragment(htmlString) {
  const templateEl = document.createElement('template');
  templateEl.innerHTML = htmlString.trim();
  return templateEl.content;
}

/**
 * Create a DOM node from a string or a node
 *
 * @param {*} content - The content to create a node from
 * @returns {Node | null} - A DOM node or null if the content is empty
 */
export function createDomNode(content) {
  if (content === null || content === undefined || content === '') {
    return null;
  }

  if (typeof content === 'string') {
    try {
      const frag = createFragment(content);

      if (frag.childNodes.length === 1) {
        return frag.firstChild;
      }

      return frag;
    }
    catch {
      return document.createTextNode(content);
    }
  }

  if (content instanceof Node) {
    return content;
  }

  return document.createTextNode(String(content));
}

export function getMetricsFromElement(element) {
  const left = parseFloat(element.style.left) || 0;
  const top = parseFloat(element.style.top) || 0;
  const width = parseFloat(element.style.width) || 0;
  const height = parseFloat(element.style.height) || 0;

  return { left, top, width, height };
}
