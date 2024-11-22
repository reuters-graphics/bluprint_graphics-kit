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
