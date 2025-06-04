import { setCookie } from '../../util/cookies.js';

export default function cookieAccept(cookieBanner, expirationDays = 365) {
  let banner = cookieBanner;
  try {
    if (!banner) banner = document.querySelector('.lds-cookie-consent');
    banner.classList.remove('active');
  } catch {
    // eslint-disable-next-line no-console
    console.error('No cookie banner passed to cookieAccept function');
  }

  setCookie('lds_allowTracking', 'enabled', expirationDays);
}
