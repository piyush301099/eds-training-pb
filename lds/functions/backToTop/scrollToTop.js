export default function scrollToTop({
  scrollOffset = 0,
  scrollBehaviour = 'smooth',
} = {}) {
  window.scrollTo({
    top: scrollOffset,
    behavior: scrollBehaviour,
  });
}
