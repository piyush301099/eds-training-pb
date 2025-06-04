/* eslint-disable class-methods-use-this */
export default class LdsSideNav {
  constructor({
    activeRoute = '',
    sideNavCollapsedText = 'Menu closed',
    sideNavExpandedText = 'Menu opened',
  }) {
    this._activeRoute = activeRoute;
    this._sideNavCollapsedText = sideNavCollapsedText;
    this._sideNaveExpandedText = sideNavExpandedText;
  }

  // Collapses a specific side nav dropdown
  #collapseDropdown(ddEl) {
    ddEl.setAttribute('data-sn-menu-expanded', 'false');
    ddEl.classList.remove('is-expanded');

    const menuToggleBtn = ddEl.querySelector('.menu-button');
    menuToggleBtn.setAttribute('aria-expanded', 'false');

    const menuDD = ddEl.querySelector('.side-nav-menu-wrapper');
    menuDD.setAttribute('inert', 'true');

    const menu = ddEl.querySelector('.side-nav-menu');
    menu.setAttribute('aria-hidden', 'true');
  }

  // Expands a specific side nav dropdown
  #expandDropdown(ddEl) {
    ddEl.setAttribute('data-sn-menu-expanded', 'true');
    ddEl.classList.add('is-expanded');

    const menuToggleBtn = ddEl.querySelector('.menu-button');
    menuToggleBtn.setAttribute('aria-expanded', 'true');

    const menuDD = ddEl.querySelector('.side-nav-menu-wrapper');
    menuDD.removeAttribute('inert');

    const menu = ddEl.querySelector('.side-nav-menu');
    menu.setAttribute('aria-hidden', 'false');
  }

  // Toggles a specific side nav dropdown open / closed
  #toggleDropdown(ddEl) {
    const isExpanded = ddEl.getAttribute('data-sn-menu-expanded') === 'true';

    if (isExpanded) {
      this.#collapseDropdown(ddEl);
    } else {
      this.#expandDropdown(ddEl);
    }
  }

  #getSideNavWrapper() {
    return document.querySelector('.lds-side-nav-wrapper');
  }

  #getMobileMenuLogo() {
    return document.querySelector('.lds-side-nav-menu-container-logo');
  }

  #getAriaLiveRegion() {
    return document.querySelector('.lds-side-nav-mobile-actions .screen-reader-text');
  }

  // Gets standard menu links
  #getSideNavLinks() {
    const links = document.querySelectorAll('li.side-nav-item a.menu-button');
    return links || [];
  }

  // Gets all dropdown menu elements
  #getSideNavDropdowns() {
    const dds = document.querySelectorAll('.side-nav-item.has-sub-menu');
    return dds || [];
  }

  // Gets all mobile menu toggle buttons (hamburger & close)
  #getMobileMenuToggles() {
    const toggles = document.querySelectorAll('button.lds-side-nav-toggle');
    return toggles || [];
  }

  // validates the html structure of the side nav on init
  #validateHtml() {
    const wrapperEl = this.#getSideNavWrapper();
    if (!wrapperEl) {
      throw new Error('ux-lds - LdsSideNav - No side nav wrapper .lds-side-nav-wrapper found');
    }

    const mobileMenuLogoArea = this.#getMobileMenuLogo();
    if (!mobileMenuLogoArea) {
      throw new Error('ux-lds - LdsSideNav - No mobile menu logo area .lds-side-nav-menu-container-logo found');
    }

    const ariaLiveEl = this.#getAriaLiveRegion();
    if (!ariaLiveEl) {
      throw new Error('ux-lds - LdsSideNav - No aria live region .lds-side-nav-mobile-actions .screen-reader-text found');
    }

    const mobileToggles = this.#getMobileMenuToggles();
    if (!mobileToggles || mobileToggles.length === 0) {
      throw new Error('ux-lds - LdsSideNav - No mobile menu toggle buttons button.lds-side-nav-toggle found');
    }
  }

  // Collapse all side nav dropdowns that do not contain the active link
  collapseInactiveDropdowns() {
    const dropdowns = document.querySelectorAll('.side-nav-item.has-sub-menu.is-expanded');
    dropdowns.forEach((dropdown) => {
      const hasActiveLink = dropdown.querySelector('.side-nav-item.active');
      if (!hasActiveLink) this.#collapseDropdown(dropdown);
    });
  }

  // Applies active link styling to an anchor where the href matches activeRoute
  setActiveLinkStyle(activeRoute) {
    this._activeRoute = activeRoute;

    document.querySelector('.side-nav-item.active')?.classList.remove('active');
    const activeLink = document.querySelector(`.side-nav-item a[href="${this._activeRoute}"]`);
    activeLink.parentElement.classList.add('active');
  }

  // Toggles the mobile menu open / closed
  toggleMobileMenu() {
    const sideNavWrapper = this.#getSideNavWrapper();

    const mobileMenuLogoArea = this.#getMobileMenuLogo();
    const closeBtn = mobileMenuLogoArea.querySelector('.lds-side-nav-toggle');

    const ariaLiveRegion = this.#getAriaLiveRegion();

    if (sideNavWrapper.classList.contains('expanded')) {
      // Set closed
      sideNavWrapper.classList.remove('expanded');
      closeBtn.setAttribute('aria-hidden', 'true');
      closeBtn.style.visibility = 'hidden';

      ariaLiveRegion.textContent = this._sideNavCollapsedText;
    } else {
      // Set open
      sideNavWrapper.classList.add('expanded');
      closeBtn.setAttribute('aria-hidden', 'false');
      closeBtn.style.visibility = 'visible';

      ariaLiveRegion.textContent = this._sideNaveExpandedText;
    }
  }

  /* Initialize the side nav.
    This sets the initial active route styling and sets up event listeners
  */
  init({ activeRoute }) {
    this.#validateHtml();

    // initialize the side nav. to be called on page load
    if (!activeRoute) {
      // eslint-disable-next-line no-console
      console.error('ux-lds - LdsSideNav - No activeRoute provided at init');
    }

    this.setActiveLinkStyle(activeRoute);

    // Set active link upon link click
    // close dropdowns when clicking a link if the link is not in the dd
    const sideNavLinks = this.#getSideNavLinks();
    sideNavLinks.forEach((link) => {
      const route = link.getAttribute('href');
      link.addEventListener('click', () => {
        this.setActiveLinkStyle(route);
        this.collapseInactiveDropdowns();
      });
    });

    // add click toggle events for dropdowns
    const sideNavDropdowns = this.#getSideNavDropdowns();
    sideNavDropdowns.forEach((dropdown) => {
      const dropdownBtn = dropdown.querySelector('.menu-button');
      const mobileDDBtn = dropdown.querySelector('.side-nav-sub-menu-back button');
      mobileDDBtn.addEventListener('click', () => {
        this.#toggleDropdown(dropdown);
      });
      dropdownBtn.addEventListener('click', () => {
        this.#toggleDropdown(dropdown);
      });
    });

    // Add click event to mobile menu toggle button (hamburger)
    const mobileMenuToggleBtns = this.#getMobileMenuToggles();
    mobileMenuToggleBtns.forEach((toggleBtn) => {
      toggleBtn.addEventListener('click', () => {
        this.toggleMobileMenu();
      });
    });
  }
}
