import tableDismissScrollOverlays from './dismissScrollOverlays.js';
import { getCookie } from '../../util/cookies.js';

export default class LdsTable {
  // MARK: Constructor
  constructor({
    id,
    // ** OPTIONALLY DISABLE FEATURES **
    disableTopScrollBar = false,
    disableScrollShadows = false,
    disableScrollOverlay = false,
    // ** UNDOCUMENTED SETTINGS - DO NOT INCLUDE IN STORYBOOK **
    // SCROLL OVERLY COOKIE SETTINGS
    // These can be set individually for a table, but that is risky
    // If a table instance is looking for a unique cookie value that is persisting for a unique duration
    // It could defeat typical usage expectations; this should only be used for edge case usage requirements
    scrollOverlayCookieName = 'lds_tableScrollOverlays',
    scrollOverlayCookieExpiration = 0,
    // LDS DEV DEBUG UTILITY
    // This feature is really complex, LDS devs can turn this on locally to try and quickly find problems
    // NEVER SET TO TRUE IN CODE COMMITS
    debug = false,
  }) {
    // MARK: Properties

    // Globals

    // Parameter Validation
    if (!id) {
      throw new Error('ux-lds - LdsTable: id (string) is required');
    } else if (typeof id !== 'string') {
      throw new Error(`ux-lds - LdsTable: id parameter received invalid type: '${typeof id}'; it must be type 'string'`);
    }

    if (typeof disableTopScrollBar !== 'boolean') {
      throw new Error(`ux-lds - LdsTable({ id: '${id}' }): disableTopScrollBar parameter received invalid type: '${typeof disableTopScrollBar}'; it must be of type 'boolean'`);
    }

    if (typeof disableScrollShadows !== 'boolean') {
      throw new Error(`ux-lds - LdsTable({ id: '${id}' }): disableScrollShadows parameter received invalid type: '${typeof disableScrollShadows}'; it must be of type 'boolean'`);
    }

    if (typeof disableScrollOverlay !== 'boolean') {
      throw new Error(`ux-lds - LdsTable({ id: '${id}' }): disableScrollOverlay parameter received invalid type: '${typeof disableScrollOverlay}'; it must be of type 'boolean'`);
    }

    if (!scrollOverlayCookieName) {
      throw new Error(`ux-lds - LdsTable({ id: '${id}' }): scrollOverlayCookieName (string) is required`);
    } else if (typeof scrollOverlayCookieName !== 'string') {
      throw new Error(`ux-lds - LdsTable({ id: '${id}' }): scrollOverlayCookieName parameter received invalid type: '${typeof scrollOverlayCookieName}'; it must be type 'string'`);
    }

    if (!scrollOverlayCookieExpiration && scrollOverlayCookieExpiration !== 0) {
      throw new Error(`ux-lds - LdsTable({ id: '${id}' }): scrollOverlayCookieExpiration (number) is required`);
    } else if (typeof scrollOverlayCookieExpiration !== 'number') {
      throw new Error(`ux-lds - LdsTable({ id: '${id}' }): scrollOverlayCookieExpiration parameter received invalid type: '${typeof scrollOverlayCookieExpiration}'; it must be type 'number'`);
    }

    // Map parameters
    this._id = id;
    this._scrollOverlayEnabled = !disableScrollOverlay;
    this._topScrollBarEnabled = !disableTopScrollBar;
    this._scrollShadowsEnabled = !disableScrollShadows;
    this._scrollOverlayCookieName = scrollOverlayCookieName;
    this._debug = debug;

    // Scroll overlay cookie expiration must be valid
    if (scrollOverlayCookieExpiration < 0) {
      this._scrollOverlayCookieExpiration = 0;
    } else if (scrollOverlayCookieExpiration > 365) {
      this._scrollOverlayCookieExpiration = 365;
    } else {
      this._scrollOverlayCookieExpiration = scrollOverlayCookieExpiration;
    }

    // Element ID's
    this._wrapperId = `${id}_wrapper`;
    this._scrollOverlayId = `${id}_scroll-overlay`;
    this._topScrollBarId = `${id}_top-scroll-bar`;
    this._topScrollBarFillId = `${id}_top-scroll-bar-fill`;
    this._scrollShadowLeftId = `${id}_scroll-shadow-left`;
    this._scrollShadowRightId = `${id}_scroll-shadow-right`;
    this._scrollBoxId = `${id}_scroll-box`;
    this._tableId = `${id}_table`;
    this._tableCaptionId = `${id}_table-caption`;
    this._visualCaptionId = `${id}_visual-caption`;

    if (this._debug) {
      // eslint-disable-next-line no-console
      console.warn(`ux-lds - LdsTable({ id: '${this._id}' }): DEVELOPMENT DEBUG MODE ENABLED\nThis feature should never be enabled in code commits or any package release. If you did not enable the debug mode and are inadvertantly receiving this message along with the debugging messages please submit a bug report to the LDS team. You can forcibly suppress these messages by setting the property "debug: false" on the LdsTable class constructor.`);
    }
  }
  // MARK: Class Methods

  /**
   * [Private] Get table element by id
   * @param {string} elementId - A valid table element id
   * @returns {HTMLElement|undefined}
   */
  #getTableElement(elementId) { // eslint-disable-line class-methods-use-this
    try {
      const el = document.getElementById(elementId);
      if (!el) {
        throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): failure getting table markup pattern element with id: '${elementId}'; HTML element reference was undefined or otherwise falsey! Table features are likely not functioning properly. Is your table markup structure well formed?`);
      } else {
        // THIS IS REALLY VERBOSE; ONLY ENABLE IF YOU REALLY NEED IT
        // if (this._debug) { console.log(`ux-lds LdsTable Debug: getTableElement for table id: '${this._id}' =>\n> Retrieved table element id: ${elementId}:`, el); /* eslint-disable-line */ }
      }
      return el;
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function getTableElement\nException:`, ex.message);
    }
  }

  /**
   * [Private] Determine if the table is scrollable
   * @returns {boolean} - true if scrollable, false if not
   */
  #isTableScrollable() {
    try {
      const elScrollBox = this.#getTableElement(this._scrollBoxId);
      // If the scroll box HTML element scrollWidth is greater than clientWidth then it is "scrollable"
      const scrollable = elScrollBox.scrollWidth > elScrollBox.clientWidth;

      if (this._debug) { console.log(`ux-lds LdsTable Debug: isTableScrollable for table id: '${this._id}' =>\n> Table scroll box element has scrollWidth: '${elScrollBox.scrollWidth}' versus clientWidth: '${elScrollBox.clientWidth}'; is scrollable?`, scrollable); /* eslint-disable-line */ }

      return scrollable;
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function isTableScrollable\nException:`, ex.message);
    }
  }

  /**
   * [Private] This function adds or removes the "scrollable" class from the table component
   * container depending on whether it is scrollable
   */
  #setTableScrollableClassWhenApplicable() {
    try {
      const el = this.#getTableElement(this._id);
      if (this.#isTableScrollable()) {
        if (!el.classList.contains('scrollable')) el.classList.add('scrollable');
        if (this._debug) { console.log(`ux-lds LdsTable Debug: setTableScrollableClassWhenApplicable for table id: '${this._id}' =>\n>  Scrollable Class: [√] ADDED (table is scrollable)`); /* eslint-disable-line */ }
      } else {
        el.classList.remove('scrollable');
        if (this._debug) { console.log(`ux-lds LdsTable Debug: setTableScrollableClassWhenApplicable for table id: '${this._id}' =>\n>  Scrollable Class: [×] REMOVED (table is not scrollable)`); /* eslint-disable-line */ }
      }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function setTableScrollableClassWhenApplicable\nException:`, ex.message);
    }
  }

  /**
   * [Private] Check for the scroll overlay dismissed cookie to determine if the scroll overlay
   * feature has been dismissed
   * @returns {boolean} - true if dismissed, false if not
   *
   * NOTE: If the scroll overlay cookie name is *unique* for this instance of an LDS Table then
   * this will only be true if this specific table has been interacted with. Otherwise, if the
   * default global cookie name value is set (not changed) then it will be true if *any* LDS
   * Table has been interacted with.
   */
  #areScrollOverlayDismissed() {
    try {
      let isDismissed = false;
      const cookie = getCookie(this._scrollOverlayCookieName);
      if (cookie === 'false') isDismissed = true;

      if (this._debug) { console.log(`ux-lds LdsTable Debug: areScrollOverlayDismissed for table id: '${this._id}' =>\n> Checked for the value of cookie: '${this._scrollOverlayCookieName}' if it exists; found value: '${cookie}'; overlays dismissed?`, isDismissed); /* eslint-disable-line */ }

      return isDismissed;
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function areScrollOverlayDismissed\nException:`, ex.message);
    }
  }

  /**
   * [Private] Function to add the scroll-overlay class when it should be enabled; it will only be visible when the table can scroll and has the scrollable class
   */
  #scrollOverlayEnableWhenApplicable() {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._scrollOverlayEnabled) return;

      const el = this.#getTableElement(this._id);
      const areOverlaysDismissed = this.#areScrollOverlayDismissed();

      if (this._debug) { console.log(`ux-lds LdsTable Debug: scrollOverlayEnableWhenApplicable for table id: '${this._id}' =>\n> Are overlays dismissed? ${areOverlaysDismissed}`); /* eslint-disable-line */ }

      // If not showing or the dismiss scroll overlays cookie is set, don't show the overlay
      if (areOverlaysDismissed) {
        el.classList.remove('scroll-overlay');
        if (this._debug) { console.log(`>>> Scroll Overlay: [×] DISABLED`); /* eslint-disable-line */ }
        return;
      }

      // Otherwise if the table is scrollable display the overlay (if it's not already visible)
      if (!el.classList.contains('scroll-overlay')) { el.classList.add('scroll-overlay'); }
      if (this._debug) { console.log(`>>> Scroll Overlay: [√] ENABLED`); /* eslint-disable-line */ }

    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function scrollOverlayEnableWhenApplicable\nException:`, ex.message);
    }
  }

  /**
   * [Private] Set the dimensions of the top scroll bar and its inner fill container based on the
   * current render of the scroll box and table elements
   */
  #topScrollBarSetCurrentDimensions() {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._topScrollBarEnabled) return;

      const elTopScrollBar = this.#getTableElement(this._topScrollBarId);
      const elTopScrollBarFill = this.#getTableElement(this._topScrollBarFillId);
      const elScrollBox = this.#getTableElement(this._scrollBoxId);
      const elTable = this.#getTableElement(this._tableId);

      // Compute the height of a scroll bar for the current browser when the table is scrollable
      // This will be the difference between the table scroll box offsetHeight and clientHeight
      // Then 1 pixel is added to ensure that the scroll bar will be visible
      const computedBrowserScrollBarHeight = (elScrollBox.offsetHeight - elScrollBox.clientHeight) + 1;

      // The width of the scroll bar inner fill container is just the current clientWidth of the table element
      const computedTableWidth = elTable.clientWidth;

      // Set the height of the top scroll bar element
      elTopScrollBar.style.height = `${computedBrowserScrollBarHeight}px`;

      // Set the width of the top scroll bar inner fill container element
      elTopScrollBarFill.style.width = `${computedTableWidth}px`;

      if (this._debug) { console.log(`ux-lds LdsTable Debug: topScrollBarSetCurrentDimensions for table id: '${this._id}' =>\n> Setting the top scroll bar base element height: '${computedBrowserScrollBarHeight}px' and its inner fill element width: '${computedTableWidth}px'`); /* eslint-disable-line */ }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function topScrollBarSetCurrentDimensions\nException:`, ex.message);
    }
  }

  /**
   * [Private] Depending on whether the table is currently scrollable set or remove scroll event
   * listeners to sync the top scroll bar scroll position with the table scroll bar scroll
   * position when either interactive element is scrolled
   */
  #topScrollBarAddRemoveListenersAsApplicable() {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._topScrollBarEnabled) return;

      const elTopScrollBar = this.#getTableElement(this._topScrollBarId);
      const elScrollBox = this.#getTableElement(this._scrollBoxId);

      if (this.#isTableScrollable) {
        // Add the listeners when scrollable

        // This listener will functionally scroll the table scroll box when the top scroll bar scrolls
        elTopScrollBar.addEventListener('scroll', () => {
          elScrollBox.scrollLeft = elTopScrollBar.scrollLeft;
        }, false);

        // This listener will functionally scroll the top scroll bar when the table scroll box scrolls
        elScrollBox.addEventListener('scroll', () => {
          elTopScrollBar.scrollLeft = elScrollBox.scrollLeft;
        }, false);

        if (this._debug) { console.log(`ux-lds LdsTable Debug: topScrollBarAddRemoveListenersAsApplicable for table id: '${this._id}' =>\n> Top Scroll Bar Listeners: [√] ADDED (table is scrollable)`); /* eslint-disable-line */ }
      } else {
        /* ** ATTEMPTING TO REMOVE THE LISTENERS THROWS AN EXCEPTION! ** */
        /* For now we'll have to risk memory leaks to use this functionality unless a better plain JS approach is found */

        // // Remove the listeners (if they exist)
        // elTopScrollBar.removeEventListener('scroll');
        // elScrollBox.removeEventListener('scroll');
        // if (this._debug) { console.log(`ux-lds LdsTable Debug: topScrollBarAddRemoveListenersAsApplicable for table id: '${this._id}' =>\n> Scroll Shadow Listener: [×] REMOVED (table is not scrollable)`); /* eslint-disable-line */ }
      }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function topScrollBarAddRemoveListenersAsApplicable\nException:`, ex.message);
    }
  }

  /**
   * [Private] Toggles the display visibility of the scroll shadows based on the input parameters
   * @param {boolean} showLeft - When true the left shadow is displayed, false hides it
   * @param {boolean} showRight - When true the right shadow is displayed, false hides it
   */
  #scrollShadowsToggleVisibility(showLeft, showRight) {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._scrollShadowsEnabled) return;

      // Toggle the left shadow
      const elShadowLeft = this.#getTableElement(this._scrollShadowLeftId);
      elShadowLeft.style.display = showLeft ? 'block' : 'none';
      elShadowLeft.style.visibility = showLeft ? 'visible' : 'hidden';

      // Toggle the right shadow
      const elShadowRight = this.#getTableElement(this._scrollShadowRightId);
      elShadowRight.style.display = showRight ? 'block' : 'none';
      elShadowRight.style.visibility = showRight ? 'visible' : 'hidden';
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function scrollShadowsToggleVisibility\nException:`, ex.message);
    }
  }

  /**
   * [Private] When the table is scrollable, this function uses the scrollLeft state of the current
   * scroll box element render to conditionally set which scroll shadows should be visible. If the
   * table is not scrollable in the current render, both the shadows will be hidden.
   */
  #scrollShadowsSetCurrentStateVisibility() {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._scrollShadowsEnabled) return;

      const elScrollBox = this.#getTableElement(this._scrollBoxId);

      // The total width the scrollbar must scroll the scroll box to reveal the entire table
      // is the difference between the scrollWidth and the clientWidth of the scroll box
      // This "scroll offset" should either be zero (not scrollable) or a positive integer
      const scrollOffset = elScrollBox.scrollWidth - elScrollBox.clientWidth;

      // Scroll offset is zero or somehow less than zero; table can't be scrolled
      // Don't show the shadows
      if (scrollOffset <= 0) {
        this.#scrollShadowsToggleVisibility(false, false);
        return;
      }

      // Scrollable table is scrolled to "hard left"
      // Show the right shadow only to indicate "more to the right"
      if (elScrollBox.scrollLeft === 0) {
        this.#scrollShadowsToggleVisibility(false, true);
        return;
      }

      // Scrollable table is scrolled neither hard left or right
      // Show both shadows to indicate "more either way"
      if ((elScrollBox.scrollLeft > 0) && (elScrollBox.scrollLeft < scrollOffset)) {
        this.#scrollShadowsToggleVisibility(true, true);
        return;
      }

      // Scrollable table is scrolled to the "hard right" scroll offset (or somehow greater than that);
      // Show the left shadow only to inidcate "more to the left"
      if (elScrollBox.scrollLeft >= scrollOffset) {
        this.#scrollShadowsToggleVisibility(true, false);
      }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function scrollShadowsSetCurrentStateVisibility\nException:`, ex.message);
    }
  }

  /**
   * [Private] Depending on whether the table is currently scrollable set or remove scroll event
   * listners to handle conditionally updating the display of the scroll shadows based on the
   * current scroll position of the table scroll box
   */
  #scrollShadowsAddRemoveListenersAsApplicable() {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._scrollShadowsEnabled) return;

      const elScrollBox = this.#getTableElement(this._scrollBoxId);

      if (this.#isTableScrollable()) {
        // Add the listener when scrollable
        elScrollBox.addEventListener('scroll', () => {
          setTimeout(() => {
            this.#scrollShadowsSetCurrentStateVisibility();
          }, 100);
        }, false);

        if (this._debug) { console.log(`ux-lds LdsTable Debug: scrollShadowsAddRemoveListenersAsApplicable for table id: '${this._id}' =>\n>  Scroll Shadow Listener: [√] ADDED (table is scrollable)`); /* eslint-disable-line */ }
      } else {
        /* ** ATTEMPTING TO REMOVE THE LISTENER THROWS AN EXCEPTION! ** */
        /* For now we'll have to risk memory leaks to use this functionality unless a better plain JS approach is found */

        // Remove the listener when scrollable
        // elScrollBox.removeEventListener('scroll');
        // if (this._debug) { console.log(`ux-lds LdsTable Debug: scrollShadowsAddRemoveListenersAsApplicable for table id: '${this._id}' =>\n>  Scroll Shadow Listener: [×] REMOVED (table is not scrollable)`); /* eslint-disable-line */ }
      }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function scrollShadowsAddRemoveListenersAsApplicable\nException:`, ex.message);
    }
  }

  /**
   * [Private] Initialize the "Scroll Overlay" feature
   */
  #initScrollOverlay() {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._scrollOverlayEnabled) return;

      this.#scrollOverlayEnableWhenApplicable();

      if (this._debug) { console.log(`ux-lds LdsTable Debug: initScrollOverlay for table id: '${this._id}' =>\n>  Scroll Overlay Feature Initialized`); /* eslint-disable-line */ }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function initScrollOverlay\nException:`, ex.message);
    }
  }

  /**
   * [Private] Initialize the "Top Scroll Bar" feature
   */
  #initTopScrollBar() {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._topScrollBarEnabled) return;

      this.#topScrollBarSetCurrentDimensions();
      this.#topScrollBarAddRemoveListenersAsApplicable();

      if (this._debug) { console.log(`ux-lds LdsTable Debug: initScrollShadows for table id: '${this._id}' =>\n>  Top Scroll Bar Feature Initialized`); /* eslint-disable-line */ }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function initTopScrollBar\nException:`, ex.message);
    }
  }

  /**
   * [Private] Initialize the "Scroll Shadows" feature
   */
  #initScrollShadows() {
    try {
      // If not using, assume the DOM does not contain the HTML; abort
      if (!this._scrollShadowsEnabled) return;

      this.#scrollShadowsSetCurrentStateVisibility();
      this.#scrollShadowsAddRemoveListenersAsApplicable();

      if (this._debug) { console.log(`ux-lds LdsTable Debug: initScrollShadows for table id: '${this._id}' =>\n>  Scroll Shadows Feature Initialized`); /* eslint-disable-line */ }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function initScrollShadows\nException:`, ex.message);
    }
  }

  /**
   * [Private] Initialize a resizeObserver to update the table features when it resizes responsively
   */
  #initTableResizeObserver() {
    try {
      // if not one thing that needs to be observed on resize is enabled, abort
      if (!this._scrollOverlayEnabled && !this._topScrollBarEnabled && !this._scrollShadowsEnabled) return;

      const elScrollBox = this.#getTableElement(this._scrollBoxId);

      const tableResizeObserver = new ResizeObserver(() => {
        if (this._debug) { console.warn(`ux-lds LdsTable Debug: tableResizeObserver for table id: '${this._id}' =>\n> Observing a Resize Event...`); /* eslint-disable-line */ }
        // Update whether the table is scrollable
        this.#setTableScrollableClassWhenApplicable();

        // Show or Hide the scroll overlay
        this.#scrollOverlayEnableWhenApplicable();

        // Update the top scroll bar dimensions and add/remove scroll listeners
        this.#topScrollBarSetCurrentDimensions();
        this.#topScrollBarAddRemoveListenersAsApplicable();

        // Update the display of the scroll shadows and add/remove scroll listeners
        this.#scrollShadowsSetCurrentStateVisibility();
        this.#scrollShadowsAddRemoveListenersAsApplicable();
      });

      tableResizeObserver.observe(elScrollBox);

      if (this._debug) { console.log(`ux-lds LdsTable Debug: initTableResizeObserver for table id: '${this._id}' =>\n>  Resize Observer Initialized`); /* eslint-disable-line */ }
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in private function initTableResizeObserver\nException:`, ex.message);
    }
  }

  /**
   * [Public] Initialize an LDS Table
   */
  init() {
    /* ***
     * DEVELOPER NOTE: This unusual structure is for facilitating clearer printing of the debug messages when enabled
     *
     * All of the init functions can be called all at once. The timeouts help make the console
     * debugging messages print out in order for tracing; they should not otherwise affect
     * the initializaiton. Neither does the initialization need to happen in an asynchronous
     * sequential manner for any specific reason.
     *** */
    try {
      // Set whether the table is initially scrollable
      if (this._debug) { console.warn(`ux-lds LdsTable Debug: init for table id: '${this._id}' =>\n> ATTEMPTING TO INITIALIZE TABLE SCROLL-ABILITY`); /* eslint-disable-line */ }
      this.#setTableScrollableClassWhenApplicable();

      /* *** Initialize the "fancy" UX features if enabled *** */
      // TOP SCROLL BAR
      setTimeout(() => {
        if (this._debug) { console.warn(`ux-lds LdsTable Debug: init for table id: '${this._id}' =>\n> ATTEMPTING TO INITIALIZE TOP SCROLL BAR FEATURE`); /* eslint-disable-line */ }
        this.#initTopScrollBar();
        if (this._debug && !this._topScrollBarEnabled) { console.warn(`>>> Initialization Aborted: Top Scroll Bar Feature was disabled for this table instance`); /* eslint-disable-line */ }

        // SCROLL OVERLAY
        setTimeout(() => {
          if (this._debug) { console.warn(`ux-lds LdsTable Debug: init for table id: '${this._id}' =>\n> ATTEMPTING TO INITIALIZE SCROLL OVERLAY FEATURE`); /* eslint-disable-line */ }
          this.#initScrollOverlay();
          if (this._debug && !this._scrollOverlayEnabled) { console.warn(`>>> Initialization Aborted: Scroll Overlay Feature was disabled for this table instance`); /* eslint-disable-line */ }

          // SCROLL SHADOWS
          setTimeout(() => {
            if (this._debug) { console.warn(`ux-lds LdsTable Debug: init for table id: '${this._id}' =>\n> ATTEMPTING TO INITIALIZE SCROLL SHADOWS FEATURE`); /* eslint-disable-line */ }
            this.#initScrollShadows();
            if (this._debug && !this._scrollShadowsEnabled) { console.warn(`>>> Initialization Aborted: Top Scroll Shadows Feature was disabled for this table instance`); /* eslint-disable-line */ }

            // RESPONSIVE RESIZE OBSERVER
            setTimeout(() => {
              if (this._debug) { console.warn(`ux-lds LdsTable Debug: init for table id: '${this._id}' =>\n> ATTEMPTING TO INITIALIZE RESPONSIVE RESIZE OBSERVER`); /* eslint-disable-line */ }
              this.#initTableResizeObserver();
              if (this._debug && (!this._topScrollBarEnabled && !this._scrollShadowsEnabled && !this._topScrollBarEnabled)) { console.warn(`>>> Initialization Aborted: Resize Observer is unnecessary because all observable features are disabled!`); /* eslint-disable-line */ }

              /* ***
              /* INTIALIZATION COMPLETE
               */
              if (this._debug) { console.warn(`ux-lds LdsTable Debug: init for table id: '${this._id}' =>\n>  Table Instance Initialized`); /* eslint-disable-line */ }

            }, 1);
          }, 1);
        }, 1);
      }, 1);
    } catch (ex) {
      throw new Error(`ux-lds - LdsTable({ id: '${this._id}' }): Unexpected exception in public function init\nCause: ${ex.cause}\nException:`, ex.message);
    }
  }

  /**
   * [Public] Dismiss swipe overlays using the library function
   * Takes no parameters but uses the class constructor properties for expirationDays and cookieName
   *
   * This is only necessary to use instead of the global function directly in the rare case of using
   * a custom overlay cookie configuration
   */
  dismissScrollOverlays() {
    if (this._debug) { console.log(`ux-lds LdsTable Debug: dismissScrollOverlays for table id: '${this._id}' =>\n>  Calling the global table utility function to dismiss overlays => tableDismissScrollOverlays(expirationDays: ${this._scrollOverlayCookieExpiration}, cookieName: ${this._scrollOverlayCookieName})`); /* eslint-disable-line */ }
    tableDismissScrollOverlays(this._scrollOverlayCookieExpiration, this._scrollOverlayCookieName);
  }
}
