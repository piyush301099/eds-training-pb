import { getCookie } from '../../util/cookies.js';

export default function getCookieAcceptance(cookieName) {
  const cookie = getCookie(cookieName);
  return cookie;
}
