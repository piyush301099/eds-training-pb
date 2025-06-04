export default class LdsAccordion {
  // MARK: Constructor
  constructor({
    id,
    open = false,
    iconClosedName = 'caret-down',
    iconClosedLabel = 'expand accordion',
    iconOpenLabel = 'collapse accordion',
    stateTransitionDuration = 400,
  }) {
    const errorLabel = 'ux-lds - Accordion:';
    const validClosedIcons = ['caret-down', 'caret-down-fill', 'caret-circle-down', 'caret-circle-down-fill', 'plus', 'plus-circle', 'plus-circle-fill'];
    const validOpenIcons = ['minus', 'minus-circle', 'minus-circle-fill'];

    if (!id) {
      throw new Error(`${errorLabel} id (string) is required`);
    } else if (typeof id !== 'string') {
      throw new Error(`${errorLabel} id parameter received invalid type: '${typeof id}'; it must be type 'string'`);
    }

    if (typeof open !== 'boolean') {
      throw new Error(`${errorLabel} open parameter received invalid type: '${typeof open}'; it must be of type 'boolean'`);
    }

    if (!iconClosedName) {
      throw new Error(`${errorLabel}: iconClosedName (string) is required; it must be one of: ${validClosedIcons}`);
    } else if (typeof iconClosedName !== 'string') {
      throw new Error(`${errorLabel}: iconClosedName parameter received invalid type: '${typeof iconClosedName}'; it must be of type 'string'`);
    } else if (!validClosedIcons.includes(iconClosedName)) {
      throw new Error(`${errorLabel}: iconClosedName parameter received an invalid value of: '${iconClosedName}'; it must be one of: ${validClosedIcons}`);
    }

    if (!iconClosedLabel) {
      throw new Error(`${errorLabel}: iconClosedLabel (string) is required`);
    } else if (typeof iconClosedLabel !== 'string') {
      throw new Error(`${errorLabel}: iconClosedLabel parameter received invalid type: '${typeof iconClosedLabel}'; it must be of type 'string'`);
    }

    if (!iconOpenLabel) {
      throw new Error(`${errorLabel}: iconOpenLabel (string) is required`);
    } else if (typeof iconOpenLabel !== 'string') {
      throw new Error(`${errorLabel}: iconOpenLabel parameter received invalid type: '${typeof iconOpenLabel}'; it must be of type 'string'`);
    }

    if (!stateTransitionDuration) {
      throw new Error(`${errorLabel}: stateTransitionDuration (number) is required`);
    } else if (typeof stateTransitionDuration !== 'number') {
      throw new Error(`${errorLabel}: stateTransitionDuration parameter received invalid type: '${typeof stateTransitionDuration}'; it must be of type 'number'`);
    }

    // Map parameters
    this._id = id;
    this._open = open;
    this._iconClosedName = iconClosedName;
    this._iconClosedLabel = iconClosedLabel;
    this._iconOpenLabel = iconOpenLabel;
    this._stateTransitionDuration = stateTransitionDuration;

    // Valid Toggle Icon Arrays
    this._validClosedIcons = validClosedIcons;
    this._validOpenIcons = validOpenIcons;
    this._validIcons = validClosedIcons.concat(validOpenIcons);

    // Element ID's
    this._headerId = `${id}_header`;
    this._toggleId = `${id}_toggle`;
    this._toggleButtonId = `${id}_toggle-button`;
    this._toggleIconId = `${id}_toggle-icon`;
    this._toggleIconLabelId = `${id}_toggle-icon-label`;
    this._bodyId = `${id}_body`;
    this._bodyPanelId = `${id}_body-panel`;

    // Correct open state icon value
    switch (iconClosedName) {
    // Swappable Icons
    case 'plus':
      this._iconOpenName = 'minus';
      break;
    case 'plus-circle':
      this._iconOpenName = 'minus-circle';
      break;
    case 'plus-circle-fill':
      this._iconOpenName = 'minus-circle-fill';
      break;
    // Rotating Closed Icons
    case 'caret-down':
    case 'caret-down-fill':
    case 'caret-circle-down':
    case 'caret-circle-down-fill':
    default:
      this._iconOpenName = undefined;
      break;
    }
  }

  // MARK: Class Methods

  // MARK: Element Refs

  // Gets and returns the Accordion root container div element
  getElement() {
    const el = document.getElementById(this._id);
    if (!el) throw new Error(`ux-lds - Accordion: failure getting the root container element with id: '${this._id}'`);
    return el;
  }

  // Gets and returns the Accordion header container div element
  getHeaderElement() {
    const el = document.getElementById(this._headerId);
    if (!el) throw new Error(`ux-lds - Accordion: failure getting the header element with id: '${this._headerId}'`);
    return el;
  }

  // Gets and returns the Accordion header toggle container div element
  getToggleElement() {
    const el = document.getElementById(this._toggleId);
    if (!el) throw new Error(`ux-lds - Accordion: failure getting the header toggle element with id: '${this._toggleId}'`);
    return el;
  }

  // Gets and returns the Accordion header toggle button element
  getToggleButtonElement() {
    const el = document.getElementById(this._toggleButtonId);
    if (!el) throw new Error(`ux-lds - Accordion: failure getting the header toggle button element with id: '${this._toggleButtonId}'`);
    return el;
  }

  // Gets and returns the Accordion header toggle icon svg element
  getToggleIconElement() {
    const el = document.getElementById(this._toggleIconId);
    if (!el) throw new Error(`ux-lds - Accordion: failure getting the header toggle icon element with id: '${this._toggleIconId}'`);
    return el;
  }

  // Gets and returns the Accordion header toggle icon svg title element
  getToggleIconLabelElement() {
    const el = document.getElementById(this._toggleIconLabelId);
    if (!el) throw new Error(`ux-lds - Accordion: failure getting the header toggle icon's accessible title element with id: '${this._toggleIconLabelId}'`);
    return el;
  }

  // Gets and returns the Accordion body container div element
  getBodyElement() {
    const el = document.getElementById(this._bodyId);
    if (!el) throw new Error(`ux-lds - Accordion: failure getting the body element with id: '${this._bodyId}'`);
    return el;
  }

  // Gets and returns the Accordion body container div element
  getBodyPanelElement() {
    const el = document.getElementById(this._bodyPanelId);
    if (!el) throw new Error(`ux-lds - Accordion: failure getting the body panel element with id: '${this._bodyPanelId}'`);
    return el;
  }

  // MARK: Private Methods

  // PRIVATE: Removes all valid icon class names from the toggle icon svg element
  clearToggleIcons() {
    const elToggleIcon = this.getToggleIconElement();

    if (elToggleIcon) {
      this._validIcons.forEach(iconName => {
        elToggleIcon.classList.remove(iconName);
      });
    }
  }

  // PRIVATE: Handles all state setting tasks
  setState(state, toggle = false) {
    const el = this.getElement();
    const elToggle = this.getToggleElement();
    const elToggleButton = this.getToggleButtonElement();
    const elToggleIcon = this.getToggleIconElement();
    const elToggleIconLabel = this.getToggleIconLabelElement();
    const elBody = this.getBodyElement();

    let swapStateIcon = false;
    if (this._iconOpenName) swapStateIcon = true;

    switch (state) {
    case 'open':
      if (toggle) {
        // Set "open" state with transition animations
        // Warning: The order of these calls is deliberate
        if (!el.classList.contains('open')) el.classList.add('open');
        if (!elToggle.classList.contains('open')) elToggle.classList.add('open');
        elToggleButton.setAttribute('aria-expanded', 'true');
        this.clearToggleIcons();
        if (swapStateIcon) {
          elToggleIcon.classList.add(this._iconOpenName);
        } else {
          elToggleIcon.classList.add(this._iconClosedName);
        }
        elToggleIconLabel.innerHTML = this._iconOpenLabel;
        elBody.style.visibility = 'visible';
        elBody.style.maxHeight = `${elBody.scrollHeight}px`;
        setTimeout(() => {
          elBody.style.overflow = 'visible';
          elBody.setAttribute('aria-hidden', 'false');
        }, this._stateTransitionDuration);
      } else {
        // Set "open" state as an initialization
        if (!el.classList.contains('open')) el.classList.add('open');
        if (!elToggle.classList.contains('open')) elToggle.classList.add('open');
        elToggleButton.setAttribute('aria-expanded', 'true');
        this.clearToggleIcons();
        if (swapStateIcon) {
          elToggleIcon.classList.add(this._iconOpenName);
        } else {
          elToggleIcon.classList.add(this._iconClosedName);
        }
        elToggleIconLabel.innerHTML = this._iconOpenLabel;
        elBody.style.maxHeight = `${elBody.scrollHeight}px`;
        elBody.style.visibility = 'visible';
        elBody.style.overflow = 'visible';
        elBody.setAttribute('aria-hidden', 'false');
      }
      break;
    case 'close':
    case 'closed':
    default:
      if (toggle) {
        // Set "closed" state with transition animations
        // Warning: The order of these calls is deliberate
        elBody.style.maxHeight = 0;
        elBody.style.overflow = 'hidden';
        setTimeout(() => {
          el.classList.remove('open');
          elBody.style.visibility = 'hidden';
          elBody.setAttribute('aria-hidden', 'true');
          elToggle.classList.remove('open');
          elToggleButton.setAttribute('aria-expanded', 'false');
          this.clearToggleIcons();
          elToggleIcon.classList.add(this._iconClosedName);
          elToggleIconLabel.innerHTML = this._iconClosedLabel;
        }, this._stateTransitionDuration);
      } else {
        // Set "closed" state as an initialization
        el.classList.remove('open');
        elToggle.classList.remove('open');
        elToggleButton.setAttribute('aria-expanded', 'false');
        this.clearToggleIcons();
        elToggleIcon.classList.add(this._iconClosedName);
        elToggleIconLabel.innerHTML = this._iconClosedLabel;
        elBody.style.maxHeight = 0;
        elBody.style.visibility = 'hidden';
        elBody.style.overflow = 'hidden';
        elBody.setAttribute('aria-hidden', 'true');
      }
    }
  }

  // MARK: Public Methods

  // MARK: Initialization

  // Initialize in the open state
  initOpen() {
    this.setState('open');
  }

  // Initialize in the closed state
  initClosed() {
    this.setState('close');
  }

  // Initializes the Accordion according to the open constructor property.
  init() {
    if (this._open) {
      this.initOpen();
    } else {
      this.initClosed();
    }
  }

  // MARK: State Toggles

  // Toggle to the closed state with transitions
  close() {
    this.setState('close', true);
  }

  // Toggle to the open state with transitions
  open() {
    this.setState('open', true);
  }

  // Toggles the state based on the current state
  // This is, at minimum, to be bound to onclick to every accordion header toggle button element
  toggle() {
    const el = this.getElement();
    if (el) {
      if (el.classList.contains('open')) {
        this.close();
      } else {
        this.open();
      }
    }
  }
}
