import { deleteCookie } from '../../util/cookies.js';

export default function cookieReset(cookieBanner) {
  deleteCookie('lds_allowTracking');

  let banner = cookieBanner;
  try {
    if (!banner) banner = document.querySelector('.lds-cookie-consent');
    banner.classList.add('active');
  } catch {
    // eslint-disable-next-line no-console
    console.error('No cookie banner found in cookieReset function');
  }
}
