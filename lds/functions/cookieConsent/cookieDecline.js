import { setCookie } from '../../util/cookies.js';

export default function cookieDecline(cookieBanner, expirationDays = 0) {
  let banner = cookieBanner;
  try {
    if (!banner) banner = document.querySelector('.lds-cookie-consent');
    banner.classList.remove('active');
  } catch {
    // eslint-disable-next-line no-console
    console.error('No cookie banner passed to cookieDecline function');
  }

  setCookie('lds_allowTracking', 'disabled', expirationDays);
}
