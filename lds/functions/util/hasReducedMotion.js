export default function hasReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)') === true || window.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
  } catch (error) {
    console.warn('ux-lds - hasReducedMotion:', error); // eslint-disable-line
    return false;
  }
}
