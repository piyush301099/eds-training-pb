/**
 * Converts camel/pascal to kebab casing.
 *
 * @param string
 * @returns {string}
 */
export const convertToKebab = (string) => (
  string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
);

/**
 * Converts kebab casing to pascal.
 *
 * @param string
 * @returns {string}
 */
export const kebabToPascal = (string) => string.split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

/**
 * Converts kebab casing to readable format.
 *
 * @param {string} string
 * @param {Boolean|string} capitalize
 * @returns {string}
 */
export const kebabToReadable = (string, capitalize = false) => (
  string.split('-')
    .map((part, i) => (
      (capitalize === 'all' || (capitalize === true && i === 0))
        ? part.charAt(0).toUpperCase() + part.slice(1)
        : part
    ))
    .join(' ')
);

/**
 * Check if a string value is valid for use in design tokens.
 * Returns true if the string contains only alphanumeric characters and hyphens/dashes.
 *
 * @param {string} string
 * @returns {Boolean}
 */
export const isValidDesignTokenString = (string) => {
  return /^[\sa-zA-Z0-9-]+$/.test(string);
};

/**
 * Check if a value is a number
 *
 * @param value value to check
 * @returns {Boolean}
 */
export const isNumber = (value) => {
  // Elimintate things that are definitely not numbers and that may coerce later badly
  if (!value) return false;
  if (value === null) return false;
  if (value === '') return false;
  if (Array.isArray(value)) return false;

  // Almost everything else should be rejected as NaN when converted by Number(), including
  // Empty Object, Non-Empty Objects, Non-Empty Arrays,
  // Non-Empty Strings that are not convertible to a number and
  // the NaN primitive itself are all NaN when processed by Number() so Number.isNaN will return true on them
  // Note we have to check for the NaN primitive this way because NaN === NaN returns false
  // See: https://eslint.org/docs/latest/rules/use-isnan
  if (Number.isNaN(Number(value))) {
    return false;
  }

  // Now, it's probably a number but let's be really sure by converting and checking typeof
  // Note that the NaN primitive is evaluated as typeof number! It should be caught earlier by Number.isNaN though
  if (typeof Number(value) === 'number') {
    return true;
  }

  // Finally if it didn't pass any explicit checks we aren't sure what it is so fail
  return false;
};
