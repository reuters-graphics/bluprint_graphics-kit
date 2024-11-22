const truthyStrings = ['true', 't', 'yes', '1'];
const falsyStrings = ['false', 'f', 'no', '0'];

/**
 * Coerce a truth-y string value to a proper boolean.
 *
 * @example
 * ```
 * truthyString('true'); // true
 * truthyString('f'); // false
 * truthrString('yes'); // true
 * truthyString('0'); // false
 * ```
 * @param string
 * @param defaultValue Default value
 * @returns `true` or `false`
 */
export const truthyString = (string: string, defaultValue = false) => {
  // trim and standardise string
  const cleaned = string.toLowerCase().trim();

  if (truthyStrings.includes(cleaned)) {
    return true;
  } else if (falsyStrings.includes(cleaned)) {
    return false;
  } else {
    return defaultValue;
  }
};
