import { setCookie } from '../../util/cookies.js';

export default function youtubeCookieAccept(cookieBanner) {
  let banner = cookieBanner;
  try {
    if (!banner) banner = document.querySelector('.lds-cookie-consent');
    banner.classList.remove('active');
  } catch {
    console.error('No cookie banner passed to cookieAccept function'); // eslint-disable-line
  }

  setCookie('lds_youtube_affirm', 'enabled', 0);
}
