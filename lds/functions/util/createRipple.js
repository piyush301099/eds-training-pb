import hasReducedMotion from './hasReducedMotion.js';

// Creates a ripple effect on a button
// Does not happen if user has prefers reduced motion set
const createRipple = (event) => {
  if (hasReducedMotion()) return;

  try {
    const button = event.currentTarget;
    const btnRect = button.getBoundingClientRect();
    const circle = document.createElement('span');
    const diameter = 164;
    const radius = diameter / 2;

    circle.style.width = `${diameter}px`;
    circle.style.height = `${diameter}px`;
    circle.style.left = `${event.pageX - (btnRect.left + radius)}px`;
    circle.style.top = `${event.pageY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    // remove the circle after the animation ends
    circle.addEventListener('animationend', () => button.removeChild(circle));

    button.appendChild(circle);
  } catch (error) {
    console.warn('ux-lds - createRipple:', error); // eslint-disable-line
  }
};

export default createRipple;
