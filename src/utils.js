// Generate a random color in rgba format. e.g. rgba(255, 0, 0, 0.5)
export function genColor(maxOpacity = 0.5) {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const opacity = Math.random() * maxOpacity;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Generate a string of random digits. e.g. 12345
export function genDigits(length = 5) {
  if (length <= 0 || !Number.isInteger(length)) {
    throw new Error('Parameter must be a positive integer');
  }

  const max = Math.pow(10, length);
  const num = Math.floor(Math.random() * max);
  return num.toString().padStart(length, '0');
}

// Like a flight number e.g. AA-123
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

export function moveChildNodes(toNode, fromNode) {
  while (fromNode.firstChild) {
    toNode.appendChild(fromNode.firstChild);
  }
}
