const trueStrings = ['true', 't', 'yes', '1'];
const falseStrings = ['false', 'f', 'no', '0'];

export const truthyString = (string) => {
  // trim and standardise string
  const cleaned = string.toLowerCase().trim();

  if (trueStrings.includes(cleaned)) {
    return true;
  } else if (falseStrings.includes(cleaned)) {
    return false;
  } else if (cleaned === '') {
    console.log(
      'Value that should be True or False is empty in the Google doc.'
    );
  } else {
    console.log(`Check your value for ${string} in your Google doc`);
  }
};
