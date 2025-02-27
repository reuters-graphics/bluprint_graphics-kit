/**
 * Coeerce a string to a valid container width.
 *
 * Used to satisfy type checking.
 *
 * @param width Width string
 * @returns valid container width
 */
export const containerWidth = (width: string) => {
  switch (width) {
    case 'narrower':
    case 'narrow':
    case 'normal':
    case 'wide':
    case 'wider':
    case 'widest':
    case 'fluid':
      return width;
    default:
      return 'normal'; // Default value if invalid
  }
};

/**
 * Validate inline ad number prop
 * @param n string
 * @returns Ad number
 */
export const inlineAdNumber = (n: string) => {
  switch (n) {
    case '1':
    case '2':
    case '3':
      return n;
    default:
      return '1';
  }
};

/**
 * Coerce a truth-y value to a proper boolean.
 *
 * @example
 * ```
 * truthyString('true'); // true
 * truthyString('f'); // false
 * truthrString('yes'); // true
 * truthyString('0'); // false
 * ```
 * @param value
 * @param defaultValue Default value
 * @returns `true` or `false`
 */
export const truthy = (value: string, defaultValue = false) => {
  // trim and standardise string
  const cleaned = value.toLowerCase().trim();

  const truthyStrings = ['true', 't', 'yes', '1'];
  const falsyStrings = ['false', 'f', 'no', '0'];

  if (truthyStrings.includes(cleaned)) {
    return true;
  } else if (falsyStrings.includes(cleaned)) {
    return false;
  } else {
    return defaultValue;
  }
};
