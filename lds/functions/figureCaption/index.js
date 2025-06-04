import createRipple from '../util/createRipple.js';

/**
 * Toggles a figure caption element open / closed.
 *
 * @param {Object} event click event from clicking the fig caption toggle button. used to create ripple effect
 * @param {String} id id of the figure caption
 * @param {String} openedText text to display in the button when the caption is open
 * @param {String} closedText text to display in the button when the caption is closed
 * @param {String} openedIcon icon to display in the button when the caption is open
 * @param {String} closedIcon icon to display in the button when the caption is closed
 *
 */
export default function figCaptionToggle({
  event,
  id,
  openedText = 'Close image description',
  closedText = 'Open image description',
  openedIcon = 'caret-circle-up-fill',
  closedIcon = 'caret-circle-up-fill',
}) {
  // MARK: Validation
  const openedIconList = [
    'caret-circle-up-fill',
    'caret-up',
    'caret-up-fill',
    'minus-circle',
    'minus-circle-fill',
    'minus',
  ];
  if (!openedIconList.includes(openedIcon)) {
    throw new Error(`ux-lds - figCaptionToggle: Invalid openedIcon: ${openedIcon}. Valid options are ${openedIconList.join(', ')}`);
  }

  const closedIconList = [
    'caret-circle-up-fill',
    'caret-up',
    'caret-up-fill',
    'plus-circle',
    'plus-circle-fill',
    'plus',
  ];
  if (!closedIconList.includes(closedIcon)) {
    throw new Error(`ux-lds - figCaptionToggle: Invalid closedIcons: ${closedIcon}. Valid options are ${closedIconList.join(', ')}`);
  }

  if (!event) {
    throw new Error('ux-lds - figCaptionToggle: event parameter required');
  }

  const figCaption = document.getElementById(id);
  if (!figCaption) {
    throw new Error(`ux-lds - figCaptionToggle: Element with id ${id} not found`);
  }

  const btnTextElem = figCaption.querySelector('.fig-btn-text');
  if (!btnTextElem) {
    throw new Error(`ux-lds - figCaptionToggle: Fig caption ${id} .fig-btn-text span not found in the toggle button`);
  }

  const svgElem = figCaption.querySelector('svg');
  if (!svgElem) {
    throw new Error(`ux-lds - figCaptionToggle: Fig caption ${id} svg element not found in the toggle button`);
  }

  // MARK: Implementation
  createRipple(event);

  // Add .icon-swap class to the svg element if using different open and close icons so it does not rotate.
  if (openedIcon !== closedIcon) {
    svgElem.classList.add('icon-swap');
  }

  const isCollapsed = figCaption.classList.contains('collapsed');

  if (isCollapsed) {
    figCaption.classList.remove('collapsed');
    btnTextElem.textContent = openedText;
    svgElem.classList.remove(closedIcon);
    svgElem.classList.add(openedIcon);
  } else {
    figCaption.classList.add('collapsed');
    btnTextElem.textContent = closedText;
    svgElem.classList.remove(openedIcon);
    svgElem.classList.add(closedIcon);
  }
}
