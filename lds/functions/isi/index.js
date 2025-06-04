import isiElements from './isiElements.js';
import getFocusableElements from '../../util/getFocusableElements.js';

const el = isiElements();

let initialized = false;
let attached = false;
let expanded = false;
let expandedMobileIndications = false;
let expandedMobileIsi = false;
let offsetTop = '0px';
let pagePosition;
let forceAttachment = false;

/**
 * Gets a DOM element by its ID attribute
 *
 * @param {String} elementId set to a valid element id attribute value that exists in the ISI DOM
 * @returns {HTMLElement|null}
 *
 * This helper function will simply get an HTMLElement object from the HTML document using the standard document.getElementById() method.
 * However, it will display an ISI specific console error if it fails to do so to aid debugging.
 * Usually if it fails, it will be because of a malformed ISI HTML pattern most likely due to copying and pasting the pattern by a developer.
 * If it fails it returns the null primitive.
 */
export function getIsiElementById(elementId) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      // eslint-disable-next-line no-console
      console.error(`LDS ISI >>> [×] Element ID '${elementId}' NOT found: ${element}`);
      return null;
    }

    // DEBUG -- Enable to make sure you're getting the DOM element you think you are; Disable in production
    // console.log(`ISI >>> [√] Element ID '${elementId}' found:`, element);

    return element;
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(`LDS ISI >>> A fatal exception occurred attempting to get Element ID '${elementId}': ${ex.message}`);
    return null;
  }
}

/**
 * Initialize the ISI feature
 * The ISI won't animate properly unless you call this function on page load.
 * If not called at all the ISI will display in "no-js" mode, as if (or if actually) JavaScript is disabled in the browser.
 */
export function isiInit() {
  if (!initialized) {
    // console.warn('ISI >>> Begin Initialization');
    const isiSection = getIsiElementById(el.isiSection);
    const isiPanel = getIsiElementById(el.isiPanel);

    /* Implicitly affirm JavaScript is loaded for CSS purposes
     * >>> COMPLIANCE FEATUERE <<<
     * ISI legally has to be displayed even if JS is disabled. Therefore ISI is decorated with
     * a 'no-js' class in its markup by default to force override any styles that may hide content
     * if JavaScript is not enabled. If JavaScript IS enabled then this initialization function
     * will run and if it does that implicitly means JavaScript is enabled thus the class is
     * removed.
     *
     * This could be avoided by attaching the ISI by default and conditionally detaching it on
     * page load.
     */
    isiSection.classList.remove('no-js');

    /* The intersection observer is not working well with document.onscroll events when the
     * location of the scroll should cause the ISI to attach or detach. This is a known issue that
     * has not been addressed. So we are falling back to the method that polls the onscroll event
     * for parity with the Vue LDS user experience for the LDS 2.0 MVP.
     * */
    // initAffixIntersectionObserver();
    initAffixOnScrollPoller();

    initPanelKeypressHandlers();

    /* Verfiy initialization for CSS purposes */
    isiPanel.classList.add('lds-isi-loaded');

    // TODO: The component needs to be refactored so that it is initially attached to the page.
    // A function would go here to then check whether the ISI should asynchronously present as detatched
    // For the LDS 2.0 MVP release we'll leave it as-is since it's on parity with Vue LDS.
    /* The detached state should be a mutation not the default.
     * This way, if the page should scroll to a focus position onload where the ISI would not be
     * detached for example, an anchor within the ISI or in content below the ISI's attached
     * location, the correct page scrolling will happen first. Right now with the ISI initially
     * detached, any initial scrolling below the ISI attach position is messed up since the page
     * height isn't correct with the ISI detatached if the scroll target is within or below the ISI.
     * The page needs to load in that situation with the ISI computed into the page height and the
     * ISI remains attached. As a collateral benefit, assuming the ISI should be attached on page
     * load means we don't need to do anything when Javascript is disabled in the browser.
     *
     * Basically we need to:
     * 1. Make initialization asynchronous to wait briefly while the page loads and potentially
     *    scrolls to a location
     * 2. Check the location of the spacer element
     * 3. If the page is scrolled to where the ISI should be attached do nothing
     * 4. If the page is NOT scrolled to where the ISI should be attached, set detached
     * Another benefit is we can add a nice animation when it detaches so that on a "typical" cold
     * hit to a site such as just loading the home page, the ISI can animate into its detached state.
     *
     * A fairly major CSS refactor will be required since the CSS assumes detached unless attached.
     * Furthermore, there's no reason to set the CSS modifier class to dozens of elements.
     * The root ISI panel element should be decorated with a "detached" class and then scope down
     * to the various elements that need to mutate on override. Overall the Vue implementation
     * relied, lazily, on the ability of Vue to easily add or remove things in the markup. This adds
     * a lot of unnecessary coding in pure JS and React.
     *
     * That last point pertains to the expanded state as well, "expanded" should be set on the root
     * panel and then that is used as a scope override.
     */

    /* Verify initialization for JS purposes */
    initialized = true;
    // console.warn('ISI >>> End Initialization');
  }
}

/* *** AFFIX OBSERVERS *** */

/**
 * Implements an intersectionObserver method for toggling the affix state of the ISI
 */
export function initAffixIntersectionObserver() {
  const isiIntersectionObserver = getIsiElementById(el.isiIntersectionObserver);
  const isiMain = getIsiElementById(el.isiMain);
  const isiMainWrapper = getIsiElementById(el.isiMainWrapper);

  /* Get the height of the ISI so we know when to detach */
  let bottomIntersectMargin = isiMain.offsetHeight;
  if (!bottomIntersectMargin || bottomIntersectMargin <= 0) bottomIntersectMargin = isiMainWrapper.offsetHeight;
  if (!bottomIntersectMargin || bottomIntersectMargin <= 0) {
    // Final Fallback
    bottomIntersectMargin = 200;
    // eslint-disable-next-line no-console
    console.warn(`LDS ISI >>> The attach/detach intersection observer could not get the offsetHeight for the isiMain or isiWrapper elements.
     The ISI script is falling back to the hard-coded default value of '${bottomIntersectMargin}px' so that the effect will happen but it may not be optimal.
     Is your ISI markup well formed and correct?`);
  }

  // DEBUG
  // console.log('ISI >>> bottomIntersectMargin:', bottomIntersectMargin);

  /* Set up the intersection observer to trigger the attach/detach effect */
  const pageScrollObserverOptions = {
    root: null, // Use the viewport as root
    rootMargin: `0px 0px -${bottomIntersectMargin}px 0px`,
    threshold: 1.0,
  };
  const pageScrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      attach();
    } else if (!entries[0].isIntersecting && entries[0].boundingClientRect.top > 0) {
      detach();
    }
  }, pageScrollObserverOptions);
  pageScrollObserver.observe(isiIntersectionObserver);
}

/**
 * Implements a document.onscroll polling method for toggling the affix state of the ISI
 */
export function initAffixOnScrollPoller() {
  // Poll the onscroll event for whether the ISI should be attached or detached
  document.onscroll = (e) => {
    // console.log('Scroll Event:', e);
    // e.preventDefault();
    // Throttle polling as much as possible for smooth affix animation
    setTimeout(() => {
      if (forceAttachment) {
        // If forceAttachement is ever set, attach the ISI if it isn't and warn
        if (!attached) {
          // eslint-disable-next-line no-console
          console.warn('LDS ISI >>> The ISI is being forcefully attached to the page; this may violate regulatory policy in a production environment.');
          setAttached(true);
          if (e.target !== document) e.target.focus();
        }
      } else {
        /* Get the main ISI Panel which is the primary container element that attaches/detaches
         * and get the ISI Spacer element which defines the ISI's total detached collapsed
         * height and it's attached location in the page (when detached).
         */
        const isiPanel = getIsiElementById(el.isiPanel);
        const isiSpacer = getIsiElementById(el.isiSpacer);

        /* The current location of the top of the ISI Panel from the inner top of the viewport
         * is necessary for all calculations
         */
        const isiPanelTop = isiPanel.getBoundingClientRect().top;

        if (attached) {
          /* Detach Affix Trigger Conditions
           * The difference between the window.innerHeight of the viewport and the height of the
           * ISI Spacer element is the location of the top of the collapsed detached ISI Panel
           * defined as the "isiDetachedTopOffset" and it is constant.
           * When "isiPanelTop" is GREATER THAN "isiDetachedTopOffset" the ISI panel should
           * detach. Note that the "isiPanelTop" variable is INCREASING as the page is scrolled up
           * towards the top.
           */
          const isiDetachedTopOffset = window.innerHeight - isiSpacer.getBoundingClientRect().height;
          // DEBUG
          // console.log(`ISI Scroll Poller would DETACH if >>> the isiPanelTop location ${isiPanelTop} > ${isiDetachedTopOffset} the difference between the window.innerHeight and the isiSpacerHeight as the isiDetachOffset; detach = ${isiPanelTop <= isiDetachedTopOffset}`);
          if (isiPanelTop > isiDetachedTopOffset) {
            setAttached(false);
            if (e.target !== document) e.target.focus();
          }
        } else {
          /* Attach Affix Trigger Conditions
           * When the ISI Spacer element's location from the top of the inner viewport defined as
           * the "isiSpacerTop" is LESS THAN OR EQUAL TO the constant detached ISI's "isiPanelTop"
           * the ISI panel should attach. Note that the "isiSpacerTop" variable is DECREASING as
           * the page is scrolled up towards the top.
           */
          const isiSpacerTop = isiSpacer.getBoundingClientRect().top;
          // DEBUG
          // console.log(`ISI Scroll Poller would Attach if >>> the isiSpacerTop location ${isiSpacerTop} <= ${isiPanelTop} the isiPanelTop location; attach = ${isiSpacerTop <= isiPanelTop}`);
          if (isiSpacerTop <= isiPanelTop) {
            setAttached(true);
            if (e.target !== document) e.target.focus();
          }
        }
      }
    }, 50);
  };
}

/* *** KEYPRESS HANDLERS *** */

/**
 * Initializes a keydown event listener on the primary ISI Panel element
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
 */
export function initPanelKeypressHandlers() {
  const isiPanel = getIsiElementById(el.isiPanel);
  isiPanel.addEventListener('keydown', (e) => {
    if (!attached) {
      if (e.shiftKey && e.key === 'Tab') {
        // User is tab navigating "backwards" or "up" towards the top of the document
        handlePanelTabBackward(e);
      } else if (e.key === 'Tab') {
        // User is tab navigating "forwards" or "down" towards the bottom of the document
        handlePanelTabForward(e);
      }
    }
  });
}

/**
 * Handles [Tab] keypress navigation "forwards" through the expanded ISI panel(s)
 *
 * @param {Object} e keydown event object (https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event)
 */
export function handlePanelTabForward(e) {
  // Always do nothing when the ISI is attached (failsafe)
  if (attached) return;

  if (!expanded) {
    // If the ISI is not expanded and we tab forward from any ISI focusable element, attach the ISI
    setAttached(true);
  } else {
    // Get all the ISI panel's focusable elements
    const isiPanel = getIsiElementById(el.isiPanel);
    const isiFELs = getFocusableElements(isiPanel);

    // Get the last (or only) focusable element in the ISI panel
    let isiLastFELindex = isiFELs.length - 1;
    if (isiLastFELindex < 0) isiLastFELindex = 0;
    const isiLastFEL = isiFELs[isiLastFELindex];

    /* When the focus is on the mobile ISI panel toggle and the mobile indications panel is expanded
     * When [Tab] is pressed, stop, expand the mobile ISI panel, collapse the mobile Indications panel.
     */
    if ((e.target.id === el.isiMobileToggleISI) && (expandedMobileIndications)) {
      e.preventDefault();
      resetScrollablePanelsToTop();
      toggleContentMobileIsi();
      return;
    }

    /* When the focus is on the mobile Indications panel toggle and the mobile ISI panel is expanded
     * When [Tab] is pressed, stop, expand the mobile Indications panel, collapse the mobile ISI panel.
     */
    if ((e.target.id === el.isiMobileToggleIND) && (expandedMobileIsi)) {
      e.preventDefault();
      resetScrollablePanelsToTop();
      toggleContentMobileIndications();
      return;
    }

    /* When the focus is on the last focusable item in the ISI
     * stop and return the user to the first focusable item in the ISI
     * User must explicitly collapse the entire ISI to tab through it
     */
    if (e.target === isiLastFEL) {
      e.preventDefault();
      resetScrollablePanelsToTop();
      isiFELs[0].focus();
    }
  }
}

/**
 * Handles [Shift]+[Tab] keypress navigation "backwards" through the expanded ISI panels
 *
 * @param {Object} e keydown event object (https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event)
 */
export function handlePanelTabBackward(e) {
  // Always do nothing when the ISI is attached (failsafe)
  if (attached) return;

  // Get all the ISI panel's focusable elements
  const isiPanel = getIsiElementById(el.isiPanel);
  const isiFELs = getFocusableElements(isiPanel);

  if (!expanded) {
    /* If the first focusable item is focused or either the ISI Banner toggle or the mobile
     * indications panel toggle are focused (which should usually be the first focusable
     * items when focusable), do nothing. This avoids unintentionally attaching the ISI.
     */
    if ((e.target === isiFELs[0])
        || (e.target.id === el.isiBanner)
        || (e.target.id === el.isiMobileToggleIND)
    ) {
      return;
    }

    /* If, somehow, the ISI is collapsed and focus is on the mobile ISI panel toggle
     * and [Shift]+[Tab] is pressed, move focus to the mobile Indications panel toggle
     * (this is an edge case)
     */
    if (e.target === el.isiMobileToggleISI) {
      const isiMobileToggleIND = getIsiElementById(el.isiMobileToggleIND);
      e.preventDefault();
      resetScrollablePanelsToTop();
      isiMobileToggleIND.focus();
      return;
    }

    // Otherwise just attach the ISI if focus is somewhere random in the panel
    setAttached(true);
  } else {
    // Get the last (or only) focusable element in the ISI panel
    let isiLastFELindex = isiFELs.length - 1;
    if (isiLastFELindex < 0) isiLastFELindex = 0;
    const isiLastFEL = isiFELs[isiLastFELindex];

    /* When the focus is on the mobile ISI panel toggle and the mobile ISI panel is expanded
     * When [Shift]+[Tab] is pressed, stop, expand the mobile Indications panel, collapsing
     * the mobile ISI panel.
     */
    if ((e.target.id === el.isiMobileToggleISI) && (expandedMobileIsi)) {
      e.preventDefault();
      resetScrollablePanelsToTop();
      toggleContentMobileIndications();
      return;
    }

    /* When the focus is on the mobile Indications panel toggle and the mobile Indications panel is expanded
     * When [Shift]+[Tab] is pressed, stop, expand the mobile ISI panel, collapsing
     * the mobile ISI panel.
     */
    if ((e.target.id === el.isiMobileToggleIND) && (expandedMobileIndications)) {
      e.preventDefault();
      resetScrollablePanelsToTop();
      toggleContentMobileIsi();
      return;
    }

    /* When the focus is on the first focusable item in the ISI
     * stop and return the user to the last focusable item in the ISI
     * User must explicitly collapse the entire ISI to tab through it
     */
    if (e.target === isiFELs[0]) {
      e.preventDefault();
      resetScrollablePanelsToTop();
      isiLastFEL.focus();
    }
  }
}

/* *** AFFIX METHODS *** */

/**
 * Toggle the attachment state of the ISI
 *
 * @param {Boolean} doAttachement the function expects to be provided with a state to set, the default is false (set DETACHED state)
 *
 * When doAttachment is false the function will attempt to DETACH the ISI, likewise when true it will attempt to ATTACH the ISI.
 */
export function setAttached(doAttachment = false) {
  if (attached === doAttachment) {
    // ABORT
    // console.warn(`LDS ISI >>> ATTACHEMENT STATE TOGGLE ABORTED: Cannot ${doAttachment ? 'attach' : 'detach'}; the ISI is already ${attached ? 'attached' : 'detached'}!`);
  } else {
    // console.warn('LDS ISI >>> Begin Toggle Attachment State');
    const isiSpacer = getIsiElementById(el.isiSpacer);
    const isiPanel = getIsiElementById(el.isiPanel);
    const isiBanner = getIsiElementById(el.isiBanner);
    const isiBannerToggleIcons = getIsiElementById(el.isiBannerToggleIcons);
    const isiMobileToggleIconsISI = getIsiElementById(el.isiMobileToggleIconsISI);
    const isiMobileToggleIconsIND = getIsiElementById(el.isiMobileToggleIconsIND);
    const isiMain = getIsiElementById(el.isiMain);
    const isiMainWrapper = getIsiElementById(el.isiMainWrapper);
    const isiMainColumnISI = getIsiElementById(el.isiMainColumnISI);
    const isiMainPanelISI = getIsiElementById(el.isiMainPanelISI);
    const isiMobileToggleISI = getIsiElementById(el.isiMobileToggleISI);
    const isiContentContainerISI = getIsiElementById(el.isiContentContainerISI);
    const isiMainColumnIND = getIsiElementById(el.isiMainColumnIND);
    const isiMainPanelIND = getIsiElementById(el.isiMainPanelIND);
    const isiMobileToggleIND = getIsiElementById(el.isiMobileToggleIND);
    const isiContentContainerIND = getIsiElementById(el.isiContentContainerIND);

    if (doAttachment) {
      // ATTACH THE ISI
      // console.log('LDS ISI >>> Attaching...');
      isiPanel.classList.add('lds-isi-attached');
      isiSpacer.classList.add('attached');
      isiBanner.classList.add('attached');
      isiBanner.tabIndex = '-1';
      isiBannerToggleIcons.classList.add('attached');
      isiMain.classList.add('attached');
      isiMainWrapper.classList.add('attached');
      isiMainColumnISI.classList.add('attached');
      isiMainPanelISI.classList.add('attached');
      isiMobileToggleISI.classList.add('attached');
      isiMobileToggleISI.tabIndex = '-1';
      isiMobileToggleIconsISI.classList.add('attached');
      isiContentContainerISI.classList.add('attached');
      isiMainColumnIND.classList.add('attached');
      isiMainPanelIND.classList.add('attached');
      isiMobileToggleIND.tabIndex = '-1';
      isiMobileToggleIND.classList.add('attached');
      isiMobileToggleIconsIND.classList.add('attached');
      isiContentContainerIND.classList.add('attached');
      attached = true;
      // console.log('LDS ISI >>> Attachment Complete!');
    } else {
      // DETACH THE ISI
      // console.log('LDS ISI >>> Detaching...');
      isiPanel.classList.remove('lds-isi-attached');
      isiSpacer.classList.remove('attached');
      isiBanner.classList.remove('attached');
      isiBanner.removeAttribute('tabindex');
      isiBannerToggleIcons.classList.remove('attached');
      isiMain.classList.remove('attached');
      isiMainWrapper.classList.remove('attached');
      isiMainColumnISI.classList.remove('attached');
      isiMainPanelISI.classList.remove('attached');
      isiMobileToggleISI.classList.remove('attached');
      isiMobileToggleISI.removeAttribute('tabindex');
      isiMobileToggleIconsISI.classList.remove('attached');
      isiContentContainerISI.classList.remove('attached');
      isiMainColumnIND.classList.remove('attached');
      isiMainPanelIND.classList.remove('attached');
      isiMobileToggleIND.removeAttribute('tabindex');
      isiMobileToggleIND.classList.remove('attached');
      isiMobileToggleIconsIND.classList.remove('attached');
      isiContentContainerIND.classList.remove('attached');
      attached = false;
      // console.log('LDS ISI >>> Detachment Complete!');
    }
    // console.warn('ISI >>> End Toggle Attachment State');
  }
}

/**
 * Adds a helper CSS class to the 'lds-isi' DOM element for fine tuning animations or transitions when the ISI is detached from the page
 */
export function togglePreDetach(isPreDetach = false) {
  const isiPanel = getIsiElementById(el.isiPanel);
  if (isPreDetach) {
    isiPanel.classList.add('lds-isi-pre-detach');
  } else {
    isiPanel.classList.remove('lds-isi-pre-detach');
  }
}

/**
 * Invoke a state change request to attach the ISI to the document
 * If successful the ISI will be inserted into the page content according to its semantic DOM location.
 */
export function attach() {
  if (attached) {
    // ABORT
    // console.warn('ISI >>> ATTACH REQUEST ABORTED: ISI is already attached; cannot attach!');
  } else {
    // console.log('ISI >>> Processing ATTACH request...');
    setAttached(true);
  }
}

/**
 * Invoke a state change request to detach the ISI from the document
 * If successful the ISI will become a collapsed "sticky drawer" element at the bottom of the viewport.
 */
export async function detach() {
  if (forceAttachment) {
    // ABORT
    // console.warn('ISI >>> DETACH REQUEST ABORTED: Forced Attachement is set; cannot detach!');
  } else if (!attached) {
    // ABORT
    // console.warn('ISI >>> DETACH REQUEST ABORTED: ISI is already detached; cannot detach!');
  } else {
    // console.log('ISI >>> Processing DETACH request...');

    togglePreDetach(true);
    setAttached(false);
    setTimeout(() => togglePreDetach(false), 500);
    // Wait a bit to remove the preDetach class
    // This prevents ugly animation "jitter" if you move up and down too slowly near the attach/detach point
    // However this prevents the "slide up" of the banner after detaching
    // setTimeout(() => this.togglePreDetach(false), 500);
  }
}

/* *** STATE TOGGLE METHODS *** */

// TODO: Set attributes on all of these elements for each value they are dependant on.
// get all data-expanded elements when expanded changes

export function setExpandedDesktop(doExpansion = false) {
  if (expanded === doExpansion) {
    // ABORT
    // console.warn(`LDS ISI >>> ISI PANEL STATE TOGGLE ABORTED: Cannot ${doExpansion ? 'expand' : 'collapse'}; the ISI Panel is already ${expanded ? 'expanded' : 'collapsed'}!`);
  } else {
    const isiPanel = getIsiElementById(el.isiPanel);
    const isiBanner = getIsiElementById(el.isiBanner);
    const isiMain = getIsiElementById(el.isiMain);
    const isiMainWrapper = getIsiElementById(el.isiMainWrapper);
    const isiBannerA11yTextCollapse = getIsiElementById(el.isiBannerA11yTextCollapse);
    const isiBannerA11yTextExpand = getIsiElementById(el.isiBannerA11yTextExpand);
    const isiBannerToggleIconCollapse = getIsiElementById(el.isiBannerToggleIconCollapse);
    const isiBannerToggleIconExpand = document.getElementById(el.isiBannerToggleIconExpand);

    if (doExpansion) {
      // Expand the ISI panel
      // console.log('LDS ISI >>> Expanding ISI panel...');
      isiPanel.classList.add('lds-isi-expanded');
      isiPanel.style.top = offsetTop;
      isiPanel.style.height = `calc(100% - ${offsetTop})`;
      isiBanner.classList.add('expanded');
      isiBanner.setAttribute('aria-expanded', true);
      isiMain.classList.add('expanded');
      isiMainWrapper.classList.add('expanded');
      isiBannerA11yTextCollapse.classList.remove('lds-isi-hidden');
      isiBannerA11yTextExpand.classList.add('lds-isi-hidden');
      isiBannerToggleIconCollapse.classList.remove('lds-isi-hidden');
      isiBannerToggleIconExpand.classList.add('lds-isi-hidden');
      expanded = true;
      // console.log('LDS ISI >>> ISI panel expand complete!');
    } else {
      // Collapse the ISI panel
      // console.log('LDS ISI >>> Collapsing ISI panel...');
      isiPanel.classList.remove('lds-isi-expanded');
      isiPanel.style.top = '0px';
      isiPanel.style.height = null;
      isiBanner.classList.remove('expanded');
      isiBanner.setAttribute('aria-expanded', false);
      isiMain.classList.remove('expanded');
      isiMainWrapper.classList.remove('expanded');
      isiBannerA11yTextCollapse.classList.add('lds-isi-hidden');
      isiBannerA11yTextExpand.classList.remove('lds-isi-hidden');
      isiBannerToggleIconCollapse.classList.add('lds-isi-hidden');
      isiBannerToggleIconExpand.classList.remove('lds-isi-hidden');
      expanded = false;
      // console.log('LDS ISI >>> ISI panel expand complete!');
    }
  }
}

export function setExpandedMobileIsi(doExpansion = false) {
  if (expandedMobileIsi === doExpansion) {
    // ABORT
    // console.warn(`LDS ISI >>> MOBILE ISI PANEL STATE TOGGLE ABORTED: Cannot ${doExpansion ? 'expand' : 'collapse'}; the Mobile ISI Panel, it is already ${expandedMobileIsi ? 'expanded' : 'collapsed'}!`);
  } else {
    const isiMainWrapper = getIsiElementById(el.isiMainWrapper);
    const isiMainColumnISI = getIsiElementById(el.isiMainColumnISI);
    const isiMainPanelISI = getIsiElementById(el.isiMainPanelISI);
    const isiMobileToggleISI = getIsiElementById(el.isiMobileToggleISI);
    const isiContentContainerISI = getIsiElementById(el.isiContentContainerISI);
    const isiMobileToggleA11yTextCollapseISI = getIsiElementById(el.isiMobileToggleA11yTextCollapseISI);
    const isiMobileToggleA11yTextExpandISI = getIsiElementById(el.isiMobileToggleA11yTextExpandISI);
    const isiMobileToggleIconCollapseISI = getIsiElementById(el.isiMobileToggleIconCollapseISI);
    const isiMobileToggleIconExpandISI = getIsiElementById(el.isiMobileToggleIconExpandISI);

    if (doExpansion) {
      // Expand the mobile ISI panel
      // console.log('LDS ISI >>> Expanding mobile ISI panel...');
      isiMainWrapper.classList.add('expanded-isi');
      isiMainColumnISI.classList.add('expanded');
      isiMainPanelISI.classList.add('expanded');
      isiMobileToggleISI.classList.add('expanded');
      isiMobileToggleISI.setAttribute('aria-expanded', true);
      isiContentContainerISI.classList.add('expanded');
      isiMobileToggleA11yTextCollapseISI.classList.remove('lds-isi-hidden');
      isiMobileToggleA11yTextExpandISI.classList.add('lds-isi-hidden');
      isiMobileToggleIconCollapseISI.classList.remove('lds-isi-hidden');
      isiMobileToggleIconExpandISI.classList.add('lds-isi-hidden');
      expandedMobileIsi = true;
      // console.log('LDS ISI >>> Mobile ISI panel expand complete!');
    } else {
      // Collapse the mobile ISI panel
      // console.log('LDS ISI >>> Collapsing mobile ISI panel...');
      isiMainWrapper.classList.remove('expanded-isi');
      isiMainColumnISI.classList.remove('expanded');
      isiMainPanelISI.classList.remove('expanded');
      isiMobileToggleISI.classList.remove('expanded');
      isiMobileToggleISI.setAttribute('aria-expanded', false);
      isiContentContainerISI.classList.remove('expanded');
      isiMobileToggleA11yTextCollapseISI.classList.add('lds-isi-hidden');
      isiMobileToggleA11yTextExpandISI.classList.remove('lds-isi-hidden');
      isiMobileToggleIconCollapseISI.classList.add('lds-isi-hidden');
      isiMobileToggleIconExpandISI.classList.remove('lds-isi-hidden');
      expandedMobileIsi = false;
      // console.log('LDS ISI >>> Mobile ISI panel collapse complete!');
    }
  }
}

export function setExpandedMobileIndications(doExpansion = false) {
  if (expandedMobileIndications === doExpansion) {
    // ABORT
    // console.warn(`LDS ISI >>> MOBILE INDICATIONS PANEL STATE TOGGLE ABORTED: Cannot ${doExpansion ? 'expand' : 'collapse'}; the Mobile Indications Panel, it is already ${expandedMobileIndications ? 'expanded' : 'collapsed'}!`);
  } else {
    // console.warn('LDS ISI >>> Begin Toggle Mobile Indications Panel State');
    const isiMainWrapper = getIsiElementById(el.isiMainWrapper);
    const isiMainColumnIND = getIsiElementById(el.isiMainColumnIND);
    const isiMainPanelIND = getIsiElementById(el.isiMainPanelIND);
    const isiMobileToggleIND = getIsiElementById(el.isiMobileToggleIND);
    const isiContentContainerIND = getIsiElementById(el.isiContentContainerIND);
    const isiMobileToggleIconCollapseIND = getIsiElementById(el.isiMobileToggleIconCollapseIND);
    const isiMobileToggleIconExpandIND = getIsiElementById(el.isiMobileToggleIconExpandIND);
    const isiMobileToggleA11yTextCollapseIND = getIsiElementById(el.isiMobileToggleA11yTextCollapseIND);
    const isiMobileToggleA11yTextExpandIND = getIsiElementById(el.isiMobileToggleA11yTextExpandIND);

    if (doExpansion) {
      // Expand the mobile indications panel
      // console.log('LDS ISI >>> Expanding mobile indications panel...');
      isiMainWrapper.classList.add('expanded-indications');
      isiMainColumnIND.classList.add('expanded');
      isiMainPanelIND.classList.add('expanded');
      isiMobileToggleIND.classList.add('expanded');
      isiMobileToggleIND.setAttribute('aria-expanded', true);
      isiContentContainerIND.classList.add('expanded');
      isiMobileToggleIconCollapseIND.classList.remove('lds-isi-hidden');
      isiMobileToggleIconExpandIND.classList.add('lds-isi-hidden');
      isiMobileToggleA11yTextCollapseIND.classList.remove('lds-isi-hidden');
      isiMobileToggleA11yTextExpandIND.classList.add('lds-isi-hidden');
      expandedMobileIndications = true;
      // console.log('LDS ISI >>> Mobile indications panel expand complete!');
    } else {
      // Collapse the mobile indications panel
      // console.log('LDS ISI >>> Collapsing mobile indications panel...');
      isiMainWrapper.classList.remove('expanded-indications');
      isiMainColumnIND.classList.remove('expanded');
      isiMainPanelIND.classList.remove('expanded');
      isiMobileToggleIND.classList.remove('expanded');
      isiMobileToggleIND.setAttribute('aria-expanded', false);
      isiContentContainerIND.classList.remove('expanded');
      isiMobileToggleIconCollapseIND.classList.add('lds-isi-hidden');
      isiMobileToggleIconExpandIND.classList.remove('lds-isi-hidden');
      isiMobileToggleA11yTextCollapseIND.classList.add('lds-isi-hidden');
      isiMobileToggleA11yTextExpandIND.classList.remove('lds-isi-hidden');
      expandedMobileIndications = false;
      // console.log('LDS ISI >>> Mobile indications panel collapse complete!');
    }
  }
}

export function turnOffMobilePanels() {
  setExpandedMobileIndications(false);
  setExpandedMobileIsi(false);
}

export function setCollapsing(isCollapsing = false) {
  const isiPanel = getIsiElementById(el.isiPanel);

  if (isCollapsing) {
    isiPanel.classList.add('lds-isi-collapsing');
  } else {
    isiPanel.classList.remove('lds-isi-collapsing');
  }
}

export function resetScrollablePanelsToTop() {
  const isiMain = getIsiElementById(el.isiMain);
  const isiContentContainerISI = getIsiElementById(el.isiContentContainerISI);
  const isiContentContainerIND = getIsiElementById(el.isiContentContainerIND);
  isiMain.scrollTo(0, 0);
  isiContentContainerISI.scrollTo(0, 0);
  isiContentContainerIND.scrollTo(0, 0);
}

export async function collapse() {
  const htmlTag = document.documentElement;
  setExpandedDesktop(false);
  setCollapsing(true);

  // Make sure that all scrollable-when-expanded ISI panels are "scrolled to top" while collapsing!
  resetScrollablePanelsToTop();

  // Update root HTML tag attributes
  htmlTag.style.top = null;
  htmlTag.removeAttribute('data-isi-expanded');

  setTimeout(() => {}, 100);

  // Use a timer to ensure "collapsing" state clears after a second
  setTimeout(() => { setCollapsing(false); }, 1000);

  // Finally, return the user to where they were on the page before the ISI was expanded (if possible)
  window.scrollTo(0, pagePosition); // TODO:
}

export function expand() {
  const htmlTag = document.documentElement;
  setExpandedDesktop(true);
  pagePosition = htmlTag.scrollTop || window.pageYOffset;
  htmlTag.setAttribute('data-isi-expanded', 'true');
  htmlTag.style.top = `-${pagePosition}px`;
}

export function togglePanel() {
  if (attached) return;

  if (expanded) {
    // ISI panel is expanded so we Collapse the ISI panel
    collapse();
  } else {
    // Expand the collapsed ISI panel
    expand();
  }
}

/* *** STATE TOGGLE ONCLICK EVENT HANDLERS *** */

/**
 * onClick Event handler function for when the Main ISI Banner (desktop) <button> is activated
 */
export function toggleContent() {
  if (attached) return;

  // Always ensure that the mobile indications panel is "collapsed" when this event is triggered
  setExpandedMobileIndications(false);

  // To ensure a clean transition between viewport widths
  // For example resizing the browser or rotating orientation on a hand-held device
  // Essentially causing a transition between the medium and large breakpoint
  // We will manage the the mobile ISI panel state
  // It has no effect above large but does below it.
  if (expanded) {
    // ISI panel is collapsing so collapse the mobile ISI panel too
    setExpandedMobileIsi(false);
  } else {
    // ISI panel is exapanding so expand the mobile ISI panel too
    setExpandedMobileIsi(true);
  }
  togglePanel();
}

/**
 * onClick Event handler function for when the Mobile ISI Toggle <button> is activated
 */
export function toggleContentMobileIsi() {
  if (attached) return;

  if (expanded) {
    // The ISI panel is expanded
    if (expandedMobileIsi) {
      // The ISI block is expanded so we need to close it AND the ISI panel
      setExpandedMobileIndications(false);
      setExpandedMobileIsi(false);
      togglePanel();
    } else {
      // The Indications block is expanded so we will ONLY collapse that block and expand the ISI block
      setExpandedMobileIndications(false);
      setExpandedMobileIsi(true);
    }
  } else {
    // The ISI panel is collapsed, expand it AND the ISI content block
    setExpandedMobileIndications(false);
    setExpandedMobileIsi(true);
    togglePanel();
  }
}

/**
 * onClick Event handler function for when the Moible Indications Toggle <button> is activated
 */
export function toggleContentMobileIndications() {
  if (attached) return;

  if (expanded) {
    // The ISI panel is expanded
    if (expandedMobileIndications) {
      // The Indications block is expanded so we need to close it AND the ISI panel
      setExpandedMobileIsi(true);
      togglePanel();
      // For smoother transitions
      // EITHER force a timed delay on the collapse of the mobile panels
      setTimeout(() => turnOffMobilePanels(), 125);
      // OR just wait a tick and then close them
      // await this.windowNextTick();
      // this.turnOffMobilePanels();
    } else {
      // The ISI block is expanded so we will ONLY collapse that block and expand the Indications block
      setExpandedMobileIndications(true);
      setExpandedMobileIsi(false);
    }
  } else {
    // The ISI panel is collapsed, expand it AND the Indications content block
    setExpandedMobileIsi(false);
    setExpandedMobileIndications(true);
    togglePanel();
  }
}
