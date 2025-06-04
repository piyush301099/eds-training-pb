import getFocusableElements from '../../util/getFocusableElements.js';
import modalClose from './modalClose.js';

export default function modalsInit(disableFocusHandlers = false) {
  const modals = document.querySelectorAll('.lds-modal');
  for (let i = 0; i < modals.length; i += 1) {
    const modalElement = modals[i];

    if (!disableFocusHandlers) {
      modalElement.addEventListener('keydown', (e) => {
        const focusableElements = getFocusableElements(modalElement);
        const focusableLength = focusableElements.length - 1;
        const isShift = e.shiftKey;

        if (e.target === focusableElements[0] && isShift && e.code === 'Tab') {
          e.preventDefault();
          focusableElements[focusableLength].focus();
        }

        // Trying to tab away from last focusable element
        // Focus on first focusable element
        if (e.target === focusableElements[focusableLength] && !isShift && e.code === 'Tab') {
          e.preventDefault();
          focusableElements[0].focus();
        }
      });
    }

    if (!modalElement.matches('.persistent')) {
      modalElement.addEventListener('click', (e) => {
        const modalId = modalElement.id;
        if (e.target.closest('.lds-modal-window')) return;
        modalClose({ modalId });
      });
    }
  }
}
