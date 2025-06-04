/* eslint-disable no-param-reassign */
// utility functions- Export Later
export function closeOpenHeaderMenu(openSubmenu) {
  openSubmenu.classList.remove('lds-header-menu-item-dropdown-active');
  openSubmenu.classList.remove('lds-header-menu-item-submenu-active');
  openSubmenu.classList.remove('lds-header-menu-item-mega-menu-active');
  const targetDiv = openSubmenu.querySelector(
    '.lds-header-submenu-container, .lds-header-mega-menu'
  );
  if (targetDiv) {
    openSubmenu.classList.toggle('lds-header-menu-item-submenu-not-active');

    targetDiv.setAttribute('aria-expanded', 'false');
    targetDiv.setAttribute('aria-hidden', 'true');
    // if it is a mega menu, set display to none
    if (targetDiv.classList.contains('lds-header-mega-menu')) {
      targetDiv.style.display = 'none';
    }
  }
}

// called when clicking outside of the menu
export function closeHeaderMenu(e) {
  const submenu = e.target.closest(
    '.lds-header-menu-item-dropdown-active, .lds-header-menu-item-mega-menu-active'
  );
  if (!submenu && e.target.tagName !== 'BUTTON') {
    const openSubmenus = document.querySelectorAll(
      '.lds-header-menu-item-dropdown-active, .lds-header-menu-item-mega-menu-active'
    );
    openSubmenus.forEach((openSubmenu) => {
      if (!openSubmenu.contains(e.target)) {
        closeOpenHeaderMenu(openSubmenu);
      }
    });
  }
}

export function closeAllHeaderMenus(parentDiv) {
  const openSubmenus = document.querySelectorAll(
    '.lds-header-menu-item-dropdown-active, .lds-header-menu-item-mega-menu-active'
  );
  openSubmenus.forEach((openSubmenu) => {
    if (openSubmenu !== parentDiv) {
      closeOpenHeaderMenu(openSubmenu);
    }
  });
}

export function closeSlidingMenus(className) {
  const allMenus = [...document.querySelectorAll(className)];
  allMenus.forEach((menu) => {
    menu.style.maxHeight = '0px';
    // wait for transition to end before setting visibility to hidden
    menu.addEventListener(
      'transitionend',
      () => {
        if (menu.style.maxHeight === '0px') {
          menu.style.visibility = 'hidden';
        }
      },
      { once: true }
    );
  });
}
export function closeContactLilly(e, isMobile) {
  e.stopPropagation();
  const parentDiv = e.target.closest(isMobile ? 'li.lds-header-utility-menu-item-mobile' : 'li.lds-header-utility-menu-item');
  const contactLillyDiv = e.target.closest('.lds-contact-lilly');
  const contactLillyToggleBtn = contactLillyDiv.querySelector('.lds-contact-lilly-toggle');
  const contactLillyDd = parentDiv.querySelector('.lds-contact-lilly-dropdown');

  closeAllHeaderMenus(parentDiv);
  closeSlidingMenus('.lds-header-submenu-container');

  contactLillyDd.style.maxHeight = '0px';
  // wait for transition to end before setting visibility to hidden
  contactLillyDd.addEventListener(
    'transitionend',
    () => {
      if (contactLillyDd.style.maxHeight === '0px') {
        contactLillyDd.style.visibility = 'hidden';
      }
    },
    { once: true }
  );

  contactLillyDiv.classList.remove('lds-contact-lilly-active');
  contactLillyToggleBtn.setAttribute('aria-expanded', false);
  contactLillyToggleBtn.setAttribute('aria-label', 'Open Contact Us');
  contactLillyToggleBtn.setAttribute('title', 'Open Contact Us');
}

export function toggleContactLilly(e, isMobile = false) {
  const parentDiv = e.target.closest(isMobile ? 'li.lds-header-utility-menu-item-mobile' : 'li.lds-header-utility-menu-item');
  const contactLillyDiv = parentDiv.querySelector('.lds-contact-lilly');
  const contactLillyToggleBtn = parentDiv.querySelector('.lds-contact-lilly-toggle');
  const contactLillyDd = parentDiv.querySelector('.lds-contact-lilly-dropdown');
  const isContactLillyOpen = contactLillyDiv.classList.contains('lds-contact-lilly-active');

  closeAllHeaderMenus(parentDiv);
  closeSlidingMenus('.lds-header-submenu-container');

  const maxHeight = contactLillyDd.scrollHeight + 24;

  if (!contactLillyDiv.classList.contains('lds-contact-lilly-active')) {
    contactLillyDd.style.maxHeight = `${maxHeight}px`;
    contactLillyDd.style.visibility = 'visible';
  } else {
    contactLillyDd.style.maxHeight = '0px';
    // wait for transition to end before setting visibility to hidden
    contactLillyDd.addEventListener(
      'transitionend',
      () => {
        if (contactLillyDd.style.maxHeight === '0px') {
          contactLillyDd.style.visibility = 'hidden';
        }
      },
      { once: true }
    );
  }

  const ariaExpanded = isContactLillyOpen ? 'false' : 'true';
  const arialabel = isContactLillyOpen ? 'Open Contact Us' : 'Close Contact Us';
  contactLillyDiv.classList.toggle('lds-contact-lilly-active');
  contactLillyToggleBtn.setAttribute('aria-expanded', ariaExpanded);
  contactLillyToggleBtn.setAttribute('aria-label', arialabel);
  contactLillyToggleBtn.setAttribute('title', arialabel);
}

export function toggleHeaderMenu(e) {
  const parentDiv = e.target.closest('li.lds-header-menu-item');
  const isSubMenuOpen = parentDiv.classList.contains('lds-header-menu-item-dropdown-active')
    || parentDiv.classList.contains('lds-header-menu-item-mega-menu-active');
  closeAllHeaderMenus(parentDiv);

  closeSlidingMenus('.lds-header-submenu-container');
  parentDiv.classList.toggle('lds-header-menu-item-dropdown-active');
  parentDiv.classList.toggle('lds-header-menu-item-submenu-active');
  parentDiv.classList.toggle('lds-header-menu-item-submenu-not-active');

  parentDiv.classList.toggle('lds-header-menu-item-mega-menu-active');
  const targetDiv = parentDiv.querySelector(
    '.lds-header-submenu-container, .lds-header-mega-menu'
  );
  if (targetDiv) {
    // get current maxheight
    if (targetDiv.classList.contains('lds-header-submenu-container')) {
      const maxHeight = calculateMenuHeight(targetDiv);

      if (getComputedStyle(targetDiv).maxHeight === '0px') {
        targetDiv.style.maxHeight = `${maxHeight}px`;
        targetDiv.style.visibility = 'visible';
      } else {
        targetDiv.style.maxHeight = '0px';
        // wait for transition to end before setting visibility to hidden
        targetDiv.addEventListener(
          'transitionend',
          () => {
            if (targetDiv.style.maxHeight === '0px') {
              targetDiv.style.visibility = 'hidden';
            }
          },
          { once: true }
        );
      }
    }
    const ariaExpanded = isSubMenuOpen ? 'false' : 'true';
    const ariaHidden = isSubMenuOpen ? 'true' : 'false';
    targetDiv.classList.toggle('open');
    targetDiv.setAttribute('aria-expanded', ariaExpanded);
    targetDiv.setAttribute('aria-hidden', ariaHidden);
    const isMegaMenu = targetDiv.classList.contains('lds-header-mega-menu');

    if (!isSubMenuOpen) {
      // Add initial entering class
      targetDiv.classList.add('megamenu-enter');
      // Change display property to block
      targetDiv.style.display = 'block';

      // Use setTimeout to ensure this happens in the next event loop
      setTimeout(() => {
        // Add class to start the transition
        targetDiv.classList.remove('megamenu-enter');
        targetDiv.classList.add('megamenu-enter-to');
      }, 0);
    } else {
      // Begin the leave transition
      // eslint-disable-next-line no-lonely-if
      if (isMegaMenu) {
        targetDiv.classList.add('megamenu-leave-to');

        // After the transition ends, set display to none
        targetDiv.addEventListener(
          'transitionend',
          () => {
            if (targetDiv.classList.contains('megamenu-leave-to')) {
              targetDiv.style.display = 'none';
              targetDiv.classList.remove('megamenu-leave-to');
            }
          },
          { once: true }
        );
      }
    }
  }
}
export function calculateMenuHeight(target) {
  // clone the element
  const element = target.cloneNode(true);

  // Temporarily modify the element
  element.style.visibility = 'hidden';
  element.style.position = 'absolute';
  element.style.maxHeight = 'none';
  element.style.display = 'block';

  // Append the element to the body
  document.body.appendChild(element);

  // Measure the height
  let height = element.offsetHeight;

  // Remove the cloned element
  document.body.removeChild(element);

  return height;
}
export function toggleMobileMenu(direction) {
  //  toggle lds-header-mobile-expanded
  const nav = document.querySelector('.lds-header-menu-wrapper');
  nav.classList.toggle('toggle-mobile-menu');
  const readerText = document.querySelector('.screen-reader-text');

  if (nav.style.display === 'none') {
    readerText.innerHTML = 'Menu open';
  } else {
    readerText.innerHTML = 'Menu closed';
  }

  if (direction === 'close') {
    document.getElementById('lds-open-menu-button').focus();
  } else {
    document.getElementById('lds-close-menu-button').focus();
  }
}
export function toggleMegaColumn(e) {
  closeSlidingMenus('.lds-header-mega-menu-menus-container');
  // toggle off all elements with the class
  // lds-header-mega-menu-container-menu-active
  const activeMenus = document.querySelectorAll(
    '.lds-header-mega-menu-container-menu-active'
  );
  activeMenus.forEach((menu) => {
    menu.classList.remove('lds-header-mega-menu-container-menu-active');
  });
  // Get the closest parent div element with the class 'lds-header-mega-menu-container-menu'
  const parentDiv = e.target.closest('.lds-header-mega-menu-container-menu');
  parentDiv.classList.toggle('lds-header-mega-menu-container-menu-active');
  // Within that parentDiv, find the div with the class 'lds-header-mega-menu-menus-container'
  const targetDiv = parentDiv.querySelector(
    '.lds-header-mega-menu-menus-container'
  );

  const maxHeight = calculateMenuHeight(targetDiv);

  // if viewport is less than 900px
  if (window.innerWidth < 900) {
    if (getComputedStyle(targetDiv).maxHeight === '0px') {
      targetDiv.style.maxHeight = `${maxHeight}px`;
      targetDiv.style.visibility = 'visible';
    } else {
      targetDiv.style.maxHeight = '0px';
      parentDiv.classList.toggle('lds-header-mega-menu-container-menu-active');

      // wait for transition to end before setting visibility to hidden
      targetDiv.addEventListener(
        'transitionend',
        () => {
          if (targetDiv.style.maxHeight === '0px') {
            targetDiv.style.visibility = 'hidden';
          }
        },
        { once: true }
      );
    }
  }
}
export function newTabAriaUtility(newTab, text) {
  return newTab ? `${text}(opens in a new tab)` : text;
}

export function animationIFFE() {
  return ((function () { // eslint-disable-line
    const classes = document.body.classList;
    let timer = 0;
    window.addEventListener('resize', function () { // eslint-disable-line
      if (timer) {
        clearTimeout(timer);
        timer = null;
      } else {
        classes.add('stop-transitions');
      }

      timer = setTimeout(() => {
        classes.remove('stop-transitions');
        timer = null;
      }, 100);
    });
  }()));
}
