import { setCookie } from '../../util/cookies.js';

/**
 * Dismiss the scroll overlays on all LDS Tables and set a cookie so that it does not show again for at least the current browser session or for no more than one year per domain.
 * @param {number} expirationDays - [OPTIONAL] the (integer) number of days the dismiss cookie will persist; the default is zero (0) for a "session cookie"; value must not be less than zero or greater than 365 (one year); leaving this as-is for the session cookie functionality is recommended.
 * @param {string} cookieName - [OPTIONAL] the name of the cookie to use, should be pre-pended with "lds_"; the default is "lds_tableScrollOverlays" and it will have a hard-coded value of boolean false so it returns a string value of 'false' when scroll overlays SHOULD BE DISABLED. Changing this default cookie name value is not recommended, if so implementers must ensure ALL LDS Table class objects need to be initialized with the custom value.
 */
export default function ldsTableDismissScrollOverlays(expirationDays = 0, cookieName = 'lds_tableScrollOverlays') {
  try {
    // Find all the LDS Table structures in the current document
    const allCurrentLdsTables = document.querySelectorAll('.lds-table-container');
    // Hide the scroll overlay feature on all of the LDS Tables found
    allCurrentLdsTables.forEach((ldsTable) => {
      ldsTable.classList.remove('scroll-overlay');
    });

    // Set a cookie to check so that the overlay no longer appears on any table
    let expiration = expirationDays;
    if (expiration < 0) expiration = 0; // Cookie expiration less than zero is invalid
    if (expiration > 365) expiration = 365; // Legal requirement to never set a cookie that persists for more than one year
    setCookie(cookieName, false, expiration);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error('ux-lds - Table: tableDismissScrollOverlays unexpected exception:', ex.message);
  }
}
