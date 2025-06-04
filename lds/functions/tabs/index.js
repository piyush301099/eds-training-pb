export default class LdsTabs {
  constructor({
    groupId,
  }) {
    if (!groupId || typeof groupId !== 'string') {
      throw new Error('ux-lds - LdsTabs: groupId (string) is required');
    }

    this._groupId = groupId;
  }

  // MARK: Private element getters

  /*
    * [Private] Gets the tab content elements
    * @returns Array of elements
  */
  #getTabs() {
    const tabs = document.querySelectorAll(`#${this._groupId} .lds-tab`);
    if (!tabs || !tabs.length) {
      throw new Error(`ux-lds - LdsTabs: unable to find tab elements with selector: #${this._groupId} .lds-tab`);
    }
    return tabs;
  }

  /*
    * [Private] Gets the buttons in desktop used to select a tab
    * @returns Array of elements
  */
  #getTabButtons() {
    const tabBtns = document.querySelectorAll(`#${this._groupId} .tab-btn:not(.tab-drawer-btn)`);
    if (!tabBtns || !tabBtns.length) {
      throw new Error(`ux-lds - LdsTabs: unable to find tab buttons with selector: #${this._groupId} .tab-btn`);
    }
    return tabBtns;
  }

  /*
    * [Private] Gets the mobile tab drawer element
    * @returns element
  */
  #getTabDrawer() {
    const drawer = document.querySelector(`#${this._groupId} .lds-tab-drawer`);
    if (!drawer) {
      throw new Error(`ux-lds - LdsTabs: unable to find tab drawer with selector: #${this._groupId} .lds-tab-drawer`);
    }
    return drawer;
  }

  /*
    * [Private] Gets the mobile dropdown wrapper element. (contains btn and dropdown)
    * @returns element
  */
  #getDropdownWrapper() {
    const dd = document.querySelector(`#${this._groupId} .lds-dropdown-wrapper`);
    if (!dd) {
      throw new Error(`ux-lds - LdsTabs: unable to find dropdown wrapper with selector: #${this._groupId} .lds-dropdown-wrapper`);
    }
    return dd;
  }

  /*
    * [Private] Gets the mobile dropdown element. (actual dd slider element)
    * @returns element
  */
  #getDropdown() {
    const dd = document.querySelector(`#${this._groupId} .lds-dropdown`);
    if (!dd) {
      throw new Error(`ux-lds - LdsTabs: unable to find dropdown with selector: #${this._groupId} .lds-dropdown`);
    }
    return dd;
  }

  /*
    * [Private] Gets the mobile drawer label element
    * @returns element
  */
  #getMobileDrawerLabel() {
    const label = document.querySelector(`#${this._groupId} .lds-tab-drawer-label`);
    if (!label) {
      throw new Error(`ux-lds - LdsTabs: unable to find drawer label with selector: #${this._groupId} .lds-tab-drawer-label`);
    }
    return label;
  }

  // MARK: Private methods

  /*
    * [Private] Sets keyboard event pattern on tabs
    * Keyboard interactions should follow this pattern https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction
  */
  #setupKeyboardEvents() {
    // Adds arrow key functionality to the desktop tab buttons
    const tabButtons = this.#getTabButtons();
    tabButtons.forEach((btn, idx) => {
      btn.addEventListener('keydown', (e) => {
        const isFirst = idx === 0;
        const isLast = idx === tabButtons.length - 1;

        if (e.key === 'ArrowLeft' && !isFirst) {
          const newIdx = idx - 1;
          const nextBtn = tabButtons[newIdx];
          nextBtn.focus();
        }

        if (e.key === 'ArrowRight' && !isLast) {
          const newIdx = idx + 1;
          const nextBtn = tabButtons[newIdx];
          nextBtn.focus();
        }

        if (e.key === 'Space' || e.key === 'Enter') {
          btn.click();
        }
      });
    });
  }

  /*
    * [Private] Sets window resize event listener
    * Tabs will switch to mobile display mode if text content in the tabs runs out of room.
  */
  #setupResizeObserver() {
    const checkWindowSize = () => {
      const tabDrawer = this.#getTabDrawer();
      const tabButtons = this.#getTabButtons();
      const tabBtnContainer = document.querySelector(`#${this._groupId} .tab-btn-container`);
      const tabContainerWidth = tabBtnContainer.offsetWidth;
      let totalTabWidth = 0;
      tabButtons.forEach((tab) => { totalTabWidth += tab.offsetWidth; });

      const forceMobileClass = 'tab-btn-container__force-mobile';
      if (totalTabWidth > tabContainerWidth) {
        tabBtnContainer.classList.add(forceMobileClass);
        tabDrawer.classList.add('d-block');
      } else {
        tabBtnContainer.classList.remove(forceMobileClass);
        tabDrawer.classList.remove('d-block');
      }
    };
    checkWindowSize();

    window.addEventListener('resize', () => {
      checkWindowSize();
    });
  }

  /*
    * [Private] Activates / shows the tab content container
    * @param {String} tabId id of the tab to activate
  */
  #activateTabContainer(tabId) {
    const tabs = this.#getTabs();
    tabs.forEach((tab) => tab.classList.remove('active'));

    // Activate the tab content container
    const newTab = document.getElementById(tabId);
    if (!newTab) {
      throw new Error(`ux-lds - LdsTabs - activateTab: unable to find tab with id: ${tabId}`);
    }
    newTab.classList.add('active');
  }

  /*
    * [Private] Activates the mobile tab drawer for a specific tabId
    * @param {String} tabId id of the tab to activate
  */
  #activateMobileTabDrawerItem(tabId) {
    // Remove active class from all drawer buttons
    const drawerButtons = document.querySelectorAll(`#${this._groupId} .lds-tab-drawer .drawer-btn`);
    drawerButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    // Activate the mobile tab button.
    const activeMBtn = document.querySelector(`#${this._groupId} .drawer-btn[data-tab-id="${tabId}"]`);
    if (!activeMBtn) {
      throw new Error(`ux-lds - LdsTabs - activateTab: unable to find tab drawer button with attribute data-tab-id=${tabId}.tab-drawer-btn`);
    }
    activeMBtn.classList.add('active');
    activeMBtn.setAttribute('aria-selected', 'true');

    // Set the label in the mobile tab drawer for the active tab
    const labelText = activeMBtn.getAttribute('data-btn-label');
    const drawerLabel = this.#getMobileDrawerLabel();
    drawerLabel.textContent = labelText;
  }

  /*
    * [Private] Activates the desktop tab button for a specific tabId
    * @param {String} tabId id of the tab to activate
  */
  #activateDesktopTabButton(tabId) {
    const tabButtons = this.#getTabButtons();

    // Remove active class and tab-ability from other tabs
    tabButtons.forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('tabindex', '-1');
    });

    // Activate the desktop tab button and make it "tab-able" w keyboard
    const activeDBtn = document.querySelector(`#${this._groupId} [data-tab-id="${tabId}"]:not(.drawer-btn)`);
    if (!activeDBtn) {
      throw new Error(`ux-lds - LdsTabs - activateTab: unable to find tab button with attribute data-tab-id=${tabId}`);
    }
    activeDBtn.classList.add('active');
    activeDBtn.setAttribute('tabindex', '0');
  }

  /*
    * [Private] Opens or closes the mobile tab drawer. Utilized by the public method toggleTabDrawer()
    * @param {Boolean} isOpen current state of the drawer. if isOpen - will be closed
  */
  #toggleTabDrawer(isOpen = false) {
    const tabDrawer = this.#getTabDrawer();
    const dropdownWrapper = this.#getDropdownWrapper();
    const dropdownBtn = document.querySelector(`#${this._groupId} .lds-dropdown-button`);
    const dropdown = this.#getDropdown();

    if (isOpen) {
      tabDrawer.classList.remove('open');
      dropdownWrapper.classList.remove('open');

      dropdown.classList.remove('open');
      dropdown.setAttribute('aria-hidden', 'true');

      dropdownBtn.setAttribute('aria-expanded', 'false');
    } else {
      tabDrawer.classList.add('open');
      dropdownWrapper.classList.add('open');

      dropdown.classList.add('open');
      dropdown.setAttribute('aria-hidden', 'false');

      dropdownBtn.setAttribute('aria-expanded', 'true');
    }
  }

  /*
    * [Private] Validates html structure of the tabs in the tab group upon init()
  */
  #validateHtml() {
    // validate the tab containers
    const tabs = this.#getTabs();
    tabs.forEach((tab) => {
      const hasIdAttr = tab.hasAttribute('id');
      if (!hasIdAttr) {
        throw new Error(
          'ux-lds - LdsTabs - validateHtml: a tab container is missing required attribute [id]'
        );
      }
    });

    // Validate desktop tab buttons
    const tabBtns = this.#getTabButtons();
    tabBtns.forEach((btn) => {
      const hasIdAttr = btn.hasAttribute('data-tab-id');
      if (!hasIdAttr) {
        throw new Error(
          'ux-lds - LdsTabs - validateHtml: a tab button is missing required attribute [data-tab-id]'
        );
      }
    });

    // Validate mobile tab drawer buttons
    const drawerBtns = document.querySelectorAll(`#${this._groupId} .drawer-btn`);
    drawerBtns.forEach((btn) => {
      const hasIdAttr = btn.hasAttribute('data-tab-id');
      if (!hasIdAttr) {
        throw new Error(
          'ux-lds - LdsTabs - validateHtml: a drawer button is missing required attribute [data-tab-id]'
        );
      }

      const hasLabelAttr = btn.hasAttribute('data-btn-label');
      if (!hasLabelAttr) {
        throw new Error(
          'ux-lds - LdsTabs - validateHtml: a drawer button is missing required attribute [data-btn-label]'
        );
      }
    });
  }

  // MARK: Public functions

  /**
   * Activates a tab from desktop tab button. To be called from the desktop tab buttons.
   *
   * @param {String} tabId id of the tab to activate
   *
  */
  activateTab(tabId) {
    if (!tabId) {
      throw new Error('ux-lds - LdsTabs - activateTab: tabId parameter is required');
    }

    this.#activateDesktopTabButton(tabId);
    this.#activateTabContainer(tabId);

    // Activate the mobile tab button.
    // Need to do this here in case screen is resized so correct styles show in mobile view
    this.#activateMobileTabDrawerItem(tabId);
    // close tab drawer
    this.#toggleTabDrawer(true);
  }

  /**
   * Toggles the mobile tab drawer open / closed.
  */
  toggleTabDrawer() {
    const tabDrawer = this.#getTabDrawer();

    if (tabDrawer.classList.contains('open')) {
      this.#toggleTabDrawer(true);
    } else {
      this.#toggleTabDrawer(false);
    }
  }

  /**
   * Initializes the tabs component. Should be called after the DOM is loaded.
  */
  init() {
    this.#validateHtml();
    this.#setupKeyboardEvents();
    this.#setupResizeObserver();
  }
}
