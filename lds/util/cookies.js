export function setCookie(cname, cvalue, exdays, samesite = 'Lax') {
  let days = exdays;

  // If the expiration days is zero then we don't set an expires policy to create a session cookie;
  // this will be the logical default
  let expires = '';

  // If the value of 'exdays' is less than zero, that is a non-fatal invalid exception, default to zero
  if (days < 0) {
    // eslint-disable-next-line no-console
    console.warn(`LDS Cookie Policy Error - Attempted to setCookie '${cname}' with an expires policy of '${days}' days, which is invalid. Defaulting to a session cookie. To resolve this warning, please set an expiration in days to either '0' (zero) to set a session cookie or to a number of days within 1-365.`);
    days = 0;
  }

  // If the value of `exdays' is more than 365, that is a non-fatal legal/regulatory exception,
  // default to 365
  if (days > 365) {
    // eslint-disable-next-line no-console
    console.warn(`LDS Cookie Policy Error - Attempted to setCookie '${cname} with an expires policy of '${days}' days, legal and regulatory compliance requires that no cookies persist for more than 365 days (one year); defaulting to 365 days. To resolve this warning, please set an expiration in days to either '0' (zero) to set a session cookie or to a number of days within 1-365.`);
    days = 365;
  }

  // If the value of `exdays` was or is now after validation greater than zero, we compute the UTC
  // date string for the expires policy
  if (days > 0) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = 'expires=' + d.toUTCString() + ';';
  }

  // Set the cookie
  document.cookie = `${cname}=${cvalue};${expires};path=/;SameSite=${samesite};`;
}

export function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export function deleteCookie(cname) {
  const d = new Date(2000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = `${cname}=false;${expires};path=/;SameSite=Lax;`;
}
