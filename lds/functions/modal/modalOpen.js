/*
  This function will attempt to open a modal with the specified modal id.
  The modal element will get the .open class applied
  The html tag will be set with the data-modal-active=true attribute to prevent scrolling
  and the data-modal-position attribute to keep track of scroll position

  If autoFocusElements parameter is set to true - when opening the modal we will try to auto focus on the first focusable element.
  We will also add keydown events to the first and last elements in the modal in order to keep focus in the modal. No tabbing outside of the modal should be available
*/
import getFocusableElements from '../../util/getFocusableElements.js';

export default function modalOpen({
  modalId,
  modal,
  autoFocusElements = true,
} = {}) {
  if (!modalId) {
    // eslint-disable-next-line no-console
    console.error('No modalId provided to modalOpen function');
    return;
  }

  const modalElement = modal || document.getElementById(modalId);
  if (!modalElement) {
    // eslint-disable-next-line no-console
    console.error(`modalOpen Error - No modal with id ${modalId} found`);
    return;
  }

  const htmlTag = document.documentElement;
  const pagePosition = htmlTag.scrollTop || window.pageYOffset;

  htmlTag.style.top = `-${pagePosition}px`;
  htmlTag.setAttribute('data-modal-active', 'true');
  htmlTag.setAttribute('data-modal-position', pagePosition); // set position so we can come back to it on close

  // Set height to window.innerHeight
  // This is required because some browsers (looking at you ios safari) will allow the 100%
  // height to go "under" elements, like an address bar or bottom buttons.
  modalElement.style.height = window.innerHeight + 'px';
  modalElement.classList.add('open');

  // Focus on the first element and add event handlers to keep focus inside the modal
  if (autoFocusElements) {
    try {
      const focusableElements = getFocusableElements(modalElement);
      focusableElements[0].focus();
    } catch (err) {
      // No focusable elements
    }
  }
}
