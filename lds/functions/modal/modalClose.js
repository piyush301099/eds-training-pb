/*
  This function will attempt to close a modal with the specified modal id.
  The modal element will get the .open class removed

  The html tag will have the data-modal-active=true attribute removed to allow scrolling
  and the data-modal-position attribute used to scroll back to the users position.
*/
export default function modalClose({ modalId, modal } = {}) {
  if (!modalId) {
    // eslint-disable-next-line no-console
    console.error('modalClose Error - No modalId provided to modalClose function');
    return;
  }

  const modalElement = modal || document.getElementById(modalId);
  if (!modalElement) {
    // eslint-disable-next-line no-console
    console.error(`modalClose Error - No modal with id ${modalId} found`);
    return;
  }

  const htmlTag = document.documentElement;
  const pagePosition = htmlTag.getAttribute('data-modal-position'); // scroll position is set when modal opened

  htmlTag.setAttribute('data-modal-active', 'false');
  htmlTag.style.top = null;
  if (pagePosition !== null) window.scrollTo(0, pagePosition);

  // Set height to window.innerHeight
  // This is required because some browsers (looking at you ios safari) will allow the 100%
  // height to go "under" elements, like an address bar or bottom buttons.
  modalElement.classList.remove('open');
  htmlTag.removeAttribute('data-modal-position');
}
