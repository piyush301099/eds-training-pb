export default class LdsSelect {
  // MARK: Constructor
  constructor({
    id,
    name,
    options = [],
    selectedOptionId = null,
    required = false,
    disabled = false,
    validationState,
    stateIconDecorative = true,
    stateIconClosedLabel = 'open options list',
    stateIconOpenLabel = 'close options list',
    debug = false,
  }) {
    // MARK: Properties

    // Parameter Validation
    if (!id) {
      throw new Error('ux-lds - LdsSelect: id (string) is required');
    } else if (typeof id !== 'string') {
      throw new Error(`ux-lds - id parameter received invalid type: '${typeof id}'; it must be type 'string'`);
    }

    this._errorContext = `ux-lds - LdsSelect({ id: '${id}' })`;

    // Optional explicit name attribute value for the input element
    if (name && typeof name !== 'string') {
      throw new Error(`${this._errorContext}: name parameter received invalid type: '${typeof name}'; it must be of type 'string'`);
    }

    // Options array can't be "required"; if selects are being populated conditionally the select may initially render empty
    if (options && !Array.isArray(options)) {
      throw new Error(`ux-lds -  options parameter received invalid type: '${typeof options}'; it must be an array of objects defining the select options`);
    }

    if (typeof required !== 'boolean') {
      throw new Error(`${this._errorContext}: required parameter received invalid type: '${typeof required}'; it must be of type 'boolean'`);
    }

    if (typeof disabled !== 'boolean') {
      throw new Error(`${this._errorContext}: disabled parameter received invalid type: '${typeof disabled}'; it must be of type 'boolean'`);
    }

    if (validationState) {
      if (typeof validationState !== 'string') {
        throw new Error(`${this._errorContext}: validationState parameter received invalid type: '${typeof validationState}'; it must be of type 'string'`);
      }
      let isValidationStateValid = false;
      switch (validationState.toLowerCase()) {
      case 'info':
      case 'success':
      case 'warning':
        // Future state, not available yet!
        isValidationStateValid = false;
        break;
      case 'error':
        isValidationStateValid = true;
        break;
      default:
        isValidationStateValid = false;
      }
      if (!isValidationStateValid) {
        throw new Error(`${this._errorContext}: validationState parameter received invalid value: '${validationState}'; it must be of one of the following values: 'error'`);
      }
    }

    if (typeof stateIconDecorative !== 'boolean') {
      throw new Error(`${this._errorContext}: stateIconDecorative parameter received invalid type: '${typeof stateIconDecorative}'; it must be of type 'boolean'`);
    }

    if (!stateIconClosedLabel) {
      throw new Error(`${this._errorContext}: stateIconClosedLabel (string) is required`);
    } else if (typeof stateIconClosedLabel !== 'string') {
      throw new Error(`${this._errorContext}: stateIconClosedLabel parameter received invalid type: '${typeof stateIconClosedLabel}'; it must be of type 'string'`);
    }

    if (!stateIconOpenLabel) {
      throw new Error(`${this._errorContext}: stateIconOpenLabel (string) is required`);
    } else if (typeof stateIconOpenLabel !== 'string') {
      throw new Error(`${this._errorContext}: stateIconOpenLabel parameter received invalid type: '${typeof stateIconOpenLabel}'; it must be of type 'string'`);
    }

    if (typeof debug !== 'boolean') {
      throw new Error(`${this._errorContext}: debug parameter received invalid type: '${typeof debug}'; it must be of type 'boolean'`);
    }

    // Map parameters
    this._id = id;
    if (name) {
      this._name = name;
    } else {
      this._name = id;
    }
    this._required = required;
    this._disabled = disabled;
    if (validationState) {
      this._validationState = validationState;
    } else {
      this._validationState = undefined;
    }
    this._options = options;
    this._selectedOptionId = selectedOptionId;
    this._stateIconDecorative = stateIconDecorative;
    this._stateIconClosedLabel = stateIconClosedLabel;
    this._stateIconOpenLabel = stateIconOpenLabel;
    this._debug = debug;

    // Element ID's
    this._wrapperId = `${id}_wrapper`;
    this._labelId = `${id}_label`;
    this._inputWrapperId = `${id}_input-wrapper`;
    this._inputId = id;
    this._buttonId = `${id}_button`;
    this._buttonLabelId = `${id}_button-label`;
    this._buttonIconId = `${id}_button-icon`;
    this._buttonIconTitleId = `${id}_button-icon-title`;
    this._dropdownWrapperId = `${id}_dropdown-wrapper`;
    this._dropdownId = `${id}_dropdown`;
    this._dropdownInnerId = `${id}_dropdown-inner`;
    this._optionsId = `${id}_options`;

    // Debug warning
    if (this._debug) {
      console.warn(`${this._errorContext}: DEVELOPMENT DEBUG MODE ENABLED\nThis feature should never be enabled in code commits or any package release. If you did not enable the debug mode and are inadvertantly receiving this message along with the debugging messages please submit a bug report to the LDS team. You can forcibly suppress these messages by setting the property "debug: false" on the LdsSelect class constructor.`); // eslint-disable-line no-console
    }
  }
  // MARK: Getters and Setters

  get required() {
    return this._required;
  }

  set required(val) {
    if (typeof val !== 'boolean') {
      throw new Error(`${this._errorContext}: setting required state received invalid type: '${typeof val}'; it must be of type 'boolean'`);
    }
    this._required = val;
    this.#setRequiredState(this._required);
  }

  get validationState() {
    return this._validationState;
  }

  set validationState(val) {
    this._validationState = val;
    this.#setInvalidState(this._validationState);
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    if (typeof val !== 'boolean') {
      throw new Error(`${this._errorContext}: setting disabled state received invalid type: '${typeof val}'; it must be of type 'boolean'`);
    }
    this._disabled = val;
    this.#setDisabledState(this._disabled);
  }

  get selectedOptionId() {
    return this._selectedOptionId;
  }

  set selectedOptionId(val) {
    this._selectedOptionId = val;
    this.handleSetSelectedOption();
  }

  // MARK: PRIVATE Methods

  /**
   * `[Private]` Get select element by id
   * @param {string} elementId - A valid table element id
   * @returns {HTMLElement|undefined}
   */
  #getSelectElement(elementId) { // eslint-disable-line class-methods-use-this
    try {
      const el = document.getElementById(elementId);
      if (!el) {
        throw new Error(`${this._errorContext}: failure getting table markup pattern element with id: '${elementId}'; HTML element reference was undefined or otherwise falsey! Table features are likely not functioning properly. Is your table markup structure well formed?`);
      } else {
        // THIS IS REALLY VERBOSE; ONLY ENABLE IF YOU REALLY NEED IT
        // if (this._debug) { console.log(`ux-lds LdsTable Debug: getTableElement for table id: '${this._id}' =>\n> Retrieved table element id: ${elementId}:`, el); /* eslint-disable-line */ }
      }
      return el;
    } catch (ex) {
      throw new Error(`${this._errorContext}: Unexpected exception in private function getSelectElement(elementId: '${elementId}')\nException:`, ex.message);
    }
  }

  /**
   * `[Private]` Configure the select component pattern as a required input
   * @param {boolean} isRequired - whether it should be set to the required state
   */
  #setRequiredState(isRequired) {
    if (this._debug) console.log(`LdsSelect.#setRequiredState(isRequired = ${isRequired}) for select id:`, this._id); // eslint-disable-line no-console
    try {
      const elInput = this.#getSelectElement(this._inputId);
      const elButton = this.#getSelectElement(this._buttonId);

      if (isRequired) {
        if (this._debug) console.log('>>> Setting REQUIRED state'); // eslint-disable-line no-console
        // set required state element values and/or toggle off not-required state element values
        elInput.setAttribute('required', 'required');
        elButton.setAttribute('aria-required', 'true');
        return;
      }

      // otherwise, set not-required state element values and/or toggle off required state element values
      if (this._debug) console.log('>>> Setting NOT REQUIRED state'); // eslint-disable-line no-console
      elInput.removeAttribute('required');
      elButton.removeAttribute('aria-required');
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #setRequiredState(isRequired: ${isRequired}); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  /**
   * `[Private]` Configure the select component pattern to display in the invalid or "error" state
   * @param {boolean} isInvalid - whether it is invalid (in error)
   */
  #setInvalidState(invalidState) {
    if (this._debug) console.log(`LdsSelect.#setInvalidState(invalidState = ${invalidState}) for select id:`, this._id); // eslint-disable-line no-console
    try {
      const elButton = this.#getSelectElement(this._buttonId);

      if (invalidState && !this._disabled) {
        let useDefault = true;
        const theState = invalidState.toLowerCase();
        switch (theState) {
        case 'info':
        case 'success':
        case 'warning':
          console.warn(`Invalid future state value for invalidState '${invalidState}}' was set, but this is not yet handled!`); // eslint-disable-line no-console
          break;
        case 'error':
          if (this._debug) console.log('>>> Setting INVALID state:', theState); // eslint-disable-line no-console
          if (!elButton.classList.contains('error')) elButton.classList.add('error');
          elButton.setAttribute('aria-invalid', 'true');
          useDefault = false;
          break;
        default:
          console.warn(`Invalid state value for invalidState '${invalidState}}' was set; cannot set state!`); // eslint-disable-line no-console
        }

        if (useDefault) {
          if (this._debug) console.log('>>> Field is not in a validation state; rendering default'); // eslint-disable-line no-console
          elButton.classList.remove('error');
          elButton.removeAttribute('aria-invalid');
        }

        return;
      }

      // Invalid State is undefined or the field is disabled; reset to default state.
      if (this._debug) console.log('>>> Field is not in a validation state; rendering default'); // eslint-disable-line no-console
      elButton.classList.remove('error');
      elButton.removeAttribute('aria-invalid');
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #setInvalidState(invalidState: ${invalidState}); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  /**
   * `[Private]` Configure the select component pattern to be in the disabled state
   * @param {boolean} isDisabled - whether it should be disabled
   */
  #setDisabledState(isDisabled) {
    if (this._debug) console.log(`LdsSelect.#setDisabledState(isDisabled = ${isDisabled}) for select id:`, this._id); // eslint-disable-line no-console
    try {
      const elLabel = this.#getSelectElement(this._labelId);
      const elButton = this.#getSelectElement(this._buttonId);

      if (isDisabled) {
        if (this._debug) console.log('>>> Setting DISABLED state'); // eslint-disable-line no-console
        // Set disabled state element values and/or toggle off enabled state element values
        if (!elLabel.classList.contains('disabled')) elLabel.classList.add('disabled');
        elButton.setAttribute('disabled', 'disabled');
        return;
      }

      // Set enabled state element values and/or toggle off disabled state element values
      if (this._debug) console.log('>>> Setting ENABLED state'); // eslint-disable-line no-console
      elLabel.classList.remove('disabled');
      elButton.removeAttribute('disabled');
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #setDisabledState(isDisabled: ${isDisabled}); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  /**
   * [Private] Create a label id for a group header options object
   * @param {string} label - the group header label value
   * @returns {string|'UNDEF'}
   *
   * If the options objects array contains group headers, they need an unique ID value; this creates one from the label text
   * If the label value is empty string or othewise falsey the value 'UNDEF' will be returned with a console warning because it must be corrected by the developer.
   */
  #getOptionGroupLabelId(label) { // eslint-disable-line class-methods-use-this
    try {
      if (label) {
        let labelId = label;
        labelId = labelId.toLowerCase();
        labelId = labelId.replaceAll(' ', '-');
        return labelId;
      }

      // eslint-disable-next-line no-console
      console.warn(`${this._errorContext}: WARNING - private function #getOptionGroupLabelId is returning value 'UNDEF' which may hinder select functionality and/or throw additional invalid id attribute errors; is your options objects array well-formed with a non-empty string text value for each option object label?`);
      return 'UNDEF';
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #getOptionGroupLabelId(label: '${label}'); Exception:`, ex.message); // eslint-disable-line no-console
      return 'UNDEF';
    }
  }

  /**
   * `[Private]` Initializes various select component pattern elements
   */
  #initElements() {
    try {
      const elLabel = this.#getSelectElement(this._labelId);
      const elInput = this.#getSelectElement(this._inputId);
      const elButton = this.#getSelectElement(this._buttonId);
      const elButtonIcon = this.#getSelectElement(this._buttonIconId);
      const elOptions = this.#getSelectElement(this._optionsId);

      elLabel.setAttribute('for', this._buttonId);

      elInput.setAttribute('type', 'hidden');
      elInput.setAttribute('name', this._name);

      elButton.setAttribute('type', 'button');
      elButton.setAttribute('aria-controls', this._dropdownId);

      elButtonIcon.setAttribute('role', 'img');
      elButtonIcon.setAttribute('focusable', false);
      if (this._stateIconDecorative) {
        elButtonIcon.setAttribute('aria-hidden', true);
      } else {
        elButtonIcon.removeAttribute('aria-hidden');
      }

      elOptions.setAttribute('role', 'listbox');
      elOptions.setAttribute('aria-hidden', 'true');
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #initElements(void); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  /**
   * `[Private]` Initializes global select component interactive element accessible keyboard event handling.
   * Primarily on the button that opens the options dropdown to provide parity with the native HTML `<select>` input element
   */
  #initAccessibleKeyboardEvents() {
    try {
      const elButton = this.#getSelectElement(this._buttonId);

      elButton.addEventListener('keydown', (e) => {
        let key;
        if (e.key === 'ArrowDown' || e.code === 'ArrowDown') key = 'ArrowDown';
        if (e.key === 'ArrowUp' || e.code === 'ArrowUp') key = 'ArrowUp';
        if (e.key === 'Space' || e.code === 'Space') key = 'Space';
        if (e.key === 'Tab' || e.code === 'Tab') key = 'Tab';

        switch (key) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'Space':
          // Prevent the default action; override with the custom action of opening the select options dropdown
          e.preventDefault();
          this.#openDropdown();
          break;
        case 'Tab':
          // Preserve default action but close the select options dropdown if open (select looses focus on tab keypress event)
          this.#openDropdown(false);
          break;
        default:
          // All other keypresses preserve the default action; GNDN
        }
      });
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #initAccessibleKeyboardEvents(void); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  /**
   * `[Private]` Optionally generates the options dropdown child elements if the class options object array is set
   *
   * On initialization this function should be called with no parameters set (void).
   *
   * RECURSIVE PARAMETERS - when handling a grouped options list this function is called within itself and takes two optional params
   * @param {Array} groupOptions - default is an empty array, when called recursively takes the options objects array of an options group to process
   * @param {string} groupLabelId - default is 'UNDEF', only used when called recursively and must be set to the id of the options group header element
   */
  #createOptionsList(groupOptions = [], groupLabelId = 'UNDEF') {
    if (this._debug) console.log(`LdsSelect.#createOptionsList ${(groupOptions.length > 0) ? `recursively processing options objects array in options group '${groupLabelId}` : 'processing default options objects array'} for select id:`, this._id); // eslint-disable-line no-console
    try {
      let opts;
      let isGrouped = false;
      if (groupOptions.length > 0) {
        // Creating grouped options for an option group
        opts = groupOptions;
        isGrouped = true;
      } else if (this._options.length > 0) {
        // Creating options or option group labels
        opts = this._options;
      } else {
        // Empty options
        return;
      }

      opts.forEach(option => {
        const elOptions = this.#getSelectElement(this._optionsId);

        if (option.value === undefined) {
          // When the option has no value it is assumed to be a group label <div>
          const thisGroupId = `${this._id}_group_${this.#getOptionGroupLabelId(option.label)}`;
          const elGroupHeading = document.createElement('div');
          elGroupHeading.classList.add('select-group-label');
          elGroupHeading.setAttribute('id', thisGroupId);
          elGroupHeading.setAttribute('tabindex', '-1');
          elGroupHeading.setAttribute('aria-hidden', 'true');
          elGroupHeading.innerHTML = option.label ? option.label : '';

          // Add the group heading to the options container element in the select dropdown panel
          elOptions.appendChild(elGroupHeading);

          // Recursively Create this group heading's options
          this.#createOptionsList(option.options, thisGroupId);
        } else {
          // When the option has a value it is assumed to be an option <button>
          const thisOptionId = `${this._id}_option_${option.value}`;
          const optionValue = option.value ? option.value : '';
          const optionLabel = option.label ? option.label : '';
          const isSelected = option.selected;

          const elOption = document.createElement('button');
          elOption.classList.add('lds-button-clear-style');
          elOption.classList.add('lds-select-option');
          if (isGrouped) elOption.classList.add('grouped');
          if (isSelected) elOption.classList.add('selected');
          elOption.setAttribute('id', thisOptionId);
          elOption.setAttribute('role', 'option');
          elOption.setAttribute('data-value', optionValue);
          elOption.setAttribute('type', 'button');
          elOption.setAttribute('tabindex', '-1');
          if (isGrouped) elOption.setAttribute('aria-describedby', groupLabelId);
          elOption.innerHTML = optionLabel;

          // An event listener will handle click events on the options to update the selected option
          elOption.addEventListener('click', () => {
            this.handleOptionClick(thisOptionId, optionValue, optionLabel);
          });

          // An event listener will handle keydown events on the options to provide keyboard UX
          elOption.addEventListener('keydown', (e) => {
            this.handleOptionKeypress(e);
          });

          // Set the selected option,
          // IF AND ONLY IF an option is flagged as selected
          // If multiple are flagged it will end up being the last option in the list that is
          if (isSelected) {
            this._selectedOptionId = thisOptionId;
          }

          // Add the option to the options container element in the select dropdown panel
          elOptions.appendChild(elOption);
        }
      });
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #createOptionsList(...)${(groupOptions.length > 0) ? ' handling a grouped options list' : ''}; Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  /**
   * `[Private]` handles opening or closing the options dropdown
   *
   * @param {boolean} open - whether to open the options dropdown, default is true (perform open actions), when false it will attempt to close the dropdown
   * @param {boolean} init - whether the dropdown is being initialized; does not set focus to the options button when initializing
   */
  #openDropdown(open = true, init = false) {
    try {
      const elInputWrapper = this.#getSelectElement(this._inputWrapperId);
      const elButton = this.#getSelectElement(this._buttonId);
      const elButtonIconTitle = this.#getSelectElement(this._buttonIconTitleId);
      const elDropdownWrapper = this.#getSelectElement(this._dropdownWrapperId);
      const elDropdown = this.#getSelectElement(this._dropdownId);
      const elOptions = this.#getSelectElement(this._optionsId);

      if (!open) {
        // close dropdown
        elInputWrapper.classList.remove('open');
        elButton.classList.remove('open');
        elButton.setAttribute('aria-expanded', 'false');
        elButtonIconTitle.innerHTML = this._stateIconClosedLabel;
        elDropdownWrapper.classList.remove('open');
        elDropdown.classList.remove('open');
        elDropdown.setAttribute('aria-hidden', 'true');
        elDropdown.setAttribute('inert', '');
        elOptions.setAttribute('aria-hidden', 'true');
        if (!init) elButton.focus();
        return;
      }

      // open dropdown
      let elSelectedOption;
      if (this._selectedOptionId) {
        // Get the currently selected option to set focus
        elSelectedOption = document.getElementById(this.selectedOptionId);
      } else {
        // Get the first selectable option to set focus if none selected
        elSelectedOption = elOptions.querySelectorAll('button:first-of-type')[0];
      }

      if (!elInputWrapper.classList.contains('open')) elInputWrapper.classList.add('open');
      if (!elButton.classList.contains('open')) elButton.classList.add('open');
      elButton.setAttribute('aria-expanded', 'true');
      elButtonIconTitle.innerHTML = this._stateIconOpenLabel;
      if (!elDropdownWrapper.classList.contains('open')) elDropdownWrapper.classList.add('open');
      if (!elDropdown.classList.contains('open')) elDropdown.classList.add('open');
      elDropdown.setAttribute('aria-hidden', 'false');
      elDropdown.removeAttribute('inert');
      elOptions.setAttribute('aria-hidden', 'false');
      elSelectedOption.focus();
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #openDropdown(open: ${open}); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  // MARK: PUBLIC Methods

  /**
   * `[Public]` initialize an instance of an LDS Select, must be called on page load or the DOMContentLoaded event
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
    setTimeout(() => {
      if (this._debug) console.log('Initializing Select ID:', this._id); // eslint-disable-line no-console
      // Initialize element attributes
      this.#initElements();

      setTimeout(() => {
        // Initialize variant states presentation
        setTimeout(() => {
          if (this._debug) console.log('>>> disabled?', this._disabled); // eslint-disable-line no-console
          this.#setDisabledState(this._disabled);
          setTimeout(() => {
            if (this._debug) console.log('>>> required?', this._required); // eslint-disable-line no-console
            this.#setRequiredState(this._required);
            setTimeout(() => {
              if (this._debug) console.log('>>> validationState:', this._validationState); // eslint-disable-line no-console
              this.#setInvalidState(this._validationState);

              setTimeout(() => {
                // Initialize the select dropdown as closed and flag as being initialized
                this.#openDropdown(false, true);

                setTimeout(() => {
                  // Create the options list from the options objects array if not empty
                  if (this._options.length > 0) this.#createOptionsList();
                  // Set the initially selected option if there was one
                  this.handleSetSelectedOption();

                  setTimeout(() => {
                    // Initialize accessibility keyboard input features
                    this.#initAccessibleKeyboardEvents();
                  }, 1);
                }, 1);
              }, 1);
            }, 1);
          }, 1);
        }, 1);
      }, 1);
    }, 1);
  }

  /**
   * `[Public]` toggles the state of the select dropdown; must be bound to the `onClick` event of the primary button element of the LDS select pattern
   */
  toggleDropdown() {
    if (this._debug) console.log('LdsSelect.toggleDropdown(void) for select id:', this._id); // eslint-disable-line no-console
    try {
      const elButton = this.#getSelectElement(this._buttonId);

      if (elButton.classList.contains('open')) {
        this.#openDropdown(false);
        return;
      }

      this.#openDropdown();
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in public function toggleDropdown(void); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  /**
   * `[Public]` Handles when a select option in the options dropdown is clicked
   *
   * @param {string} id - the id of the option instance
   * @param {string|number|boolean} value - the data value of the option instance
   * @param {string} label - the text label of the option instance
   *
   * Updates the related select component's hidden input field value with the current value and also set the select to show the clicked option as the currently selected option (which updates various component elements).
   *
   * When the LDS Select is initialized with an options object array, this function will be automatically bound to each selectable option element via an `eventListener`.
   * However, if creating a customized/manual LDS Select pattern implementation, this function (or one like it) must be bound to every selectable option or the compopnent will not function.
   */
  handleOptionClick(optionId, optionValue, optionLabel) {
    if (this._debug) console.log(`Handling option click for select id: '${this._id}'\n>>> id: ${optionId}\n>>>value: ${optionValue}\n>>>label: ${optionLabel}`); // eslint-disable-line no-console
    try {
      this._selectedOptionId = optionId;
      this.handleSetSelectedOption();
      this.#openDropdown(false);
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in private function #handleOptionClick(id: ${optionId}, value: ${optionValue}, label: ${optionLabel}); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }

  /**
   * [Public] Handles keypresses on a aselect option in the options dropdown; provides critical and necessary accessible keyboard interaction on par with using the native HTML `<select>` input element
   *
   * @param {Event} e - the keypress event object
   *
   * When the LDS Select is initialized with an options object array, this function will be automatically bound to each selectable option element via an `eventListener`.
   * However, if creating a customized/manual LDS Select pattern implementation, this function (or one like it) must be bound to every selectable option for keyboard UX and accessibility compliance.
   */
  handleOptionKeypress(e) {
    if (this._debug) console.log(`Handling option keypress event for select id: '${this._id}'\n>>> Recieved event object:`, e); // eslint-disable-line no-console
    try {
      if (this._debug) console.log('Select option keydown event detected... e:', e); // eslint-disable-line no-console
      const isAdn = (e.key === 'ArrowDown' || e.code === 'ArrowDown');
      const isAup = (e.key === 'ArrowUp' || e.code === 'ArrowUp');
      const isTab = (e.key === 'Tab' || e.code === 'Tab');
      const isEsc = (e.key === 'Escape' || e.code === 'Escape');

      if (this._debug) {
        /* eslint-disable brace-style, no-console */
        if (isAdn) { console.log('>>> Handling key [Arrow Down]'); }
        else if (isAup) { console.log('>>> Handling key [Arrow Down]'); }
        else if (isTab) { console.log('>>> Handling key [Tab]'); }
        else if (isEsc) { console.log('>>> Handling key [Escape]'); }
        else { console.log(`>>> Unhandled key [${e.key}]`); }
        /* eslint-enable brace-style, no-console */
      }

      if (isEsc || isTab) {
        if (this._debug) console.log('>>> Invoking #openDropdown(false), this should close the options dropdown and then pass focus back the select button; also default action of the keypress is preserved'); // eslint-disable-line no-console
        this.#openDropdown(false);
      } else if (isAup || isAdn) {
        e.preventDefault();
        if (this._debug) console.log(`>>> User is trying to move ${isAup ? 'up' : 'down'} through the options list; default arrow key event is prevented, begin handling the custom select dropdown navigation use case...`); // eslint-disable-line no-console

        const elOptions = this.#getSelectElement(this._optionsId);
        const nlOptions = elOptions.querySelectorAll('button');

        if (this._debug) console.log('>>> > All selectable options in this select\'s dropdown:', nlOptions); // eslint-disable-line no-console

        const elCurrentOption = e.target;

        if (this._debug) console.log('>>> > Currently focused option id handling the keypress:', elCurrentOption); // eslint-disable-line no-console

        const totalOptions = nlOptions.length;
        const lastOptionIndex = totalOptions - 1;
        let currentOptionIndex = 0;

        // If QAT with a huge number of options indicates a performance issue, this may need to be re-evaluated
        // It needs to break when it finds the current option index so could not use forEach.
        // eslint-disable-next-line no-restricted-syntax
        for (const option of nlOptions) {
          if (option.id !== elCurrentOption.id) {
            // This is not the current option, so either
            if (currentOptionIndex === lastOptionIndex) {
              // It was not found, which should not happen
              if (this._debug) console.warn(`>>> > WARNING: The current option's id value '${elCurrentOption.id}' wasn't found on any option object in the list of options:`, nlOptions); // eslint-disable-line no-console
              currentOptionIndex = NaN;
              break;
            } else {
              // There are more options, so increment the index value and continue to look for it
              currentOptionIndex += 1;
            }
          } else {
            // This is the current option; abort index search (value of currentOptionIndex is the index)
            break;
          }
        }

        if (this._debug) console.log(`>>> > There are ${totalOptions} total options; the user is at option index ${currentOptionIndex} of ${lastOptionIndex}`); // eslint-disable-line no-console

        if (isAup) {
          if (currentOptionIndex === 0) {
            // If at the first option, move focus to the last option
            nlOptions[lastOptionIndex].focus();
            if (this._debug) console.log('>>> > Going UP from the FIRST option moves focus to the LAST option; Keypress handling complete!'); // eslint-disable-line no-console
          } else {
            // Move focus to the previous option index
            nlOptions[currentOptionIndex - 1].focus();
            if (this._debug) console.log(`>>> > Going UP from option index ${currentOptionIndex} moves focus to option index ${currentOptionIndex - 1}; Keypress handling complete!`); // eslint-disable-line no-console
          }
        } else if (isAdn) {
          if (currentOptionIndex === lastOptionIndex) {
            // If at the last option, move focus to the first option
            nlOptions[0].focus();
            if (this._debug) console.log('>>> > Going DOWN from the LAST option moves focus to the FIRST option; Keypress handling complete!'); // eslint-disable-line no-console
          } else {
            // Move focus to the previous option index
            nlOptions[currentOptionIndex + 1].focus();
            if (this._debug) console.log(`>>> > Going DWON from option index ${currentOptionIndex} moves focus to option index ${currentOptionIndex + 1}; Keypress handling complete!`); // eslint-disable-line no-console
          }
        }
      } else {
        if (this._debug) console.log('>>> > Unhandled key; allow default action; Keypress handler is aborting without error...'); // eslint-disable-line no-console, no-lonely-if
      }
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in public function handleOptionKeypress(e); Exception: ${ex.message}\nHandled event object:`, e); // eslint-disable-line no-console
    }
  }

  /**
   * `[Public]` handles setting the selected option to the current class value of `selectedOptionId`
   *
   * This is automatically called when using the setter function for `selectedOptionId`, on an option selection event, and when initializing the select with a default selected option.
   * Should not typically need to be called directly but is available if necessary.
   */
  handleSetSelectedOption() {
    if (this._debug) console.log(`Updating the selected option for select id: '${this._id}' to option id:`, this._selectedOptionId); // eslint-disable-line no-console
    try {
      const elInput = this.#getSelectElement(this._inputId);
      const elButton = this.#getSelectElement(this._buttonId);
      const elButtonLabel = this.#getSelectElement(this._buttonLabelId);

      let hasSelectedOptionId = false;

      if (this._selectedOptionId) {
        const elOptions = this.#getSelectElement(this._optionsId);
        const nlOptions = elOptions.querySelectorAll('button');

        // eslint-disable-next-line no-restricted-syntax
        for (const option of nlOptions) {
          if (option.id === this._selectedOptionId) {
            if (this._debug) {
              /* eslint-disable no-console */
              console.log(`>>> Found selected option id '${option.id}'in the list of option nodes; element:`, option);
              console.log('>>> Option Value:', option.dataset.value);
              console.log('>>> Option Label:', option.innerHTML);
              console.log('>>> Setting this option as the selected option...');
              /* eslint-enable no-console */
            }
            elInput.setAttribute('value', option.dataset.value);
            elButton.setAttribute('aria-describedby', option.id);
            elButtonLabel.textContent = option.innerHTML;
            if (!option.classList.contains('selected')) option.classList.add('selected');
            hasSelectedOptionId = true;
          } else {
            option.classList.remove('selected');
          }
        }
      }

      if (!hasSelectedOptionId) {
        if (this._debug) console.log('>>> No selected option; setting the unselected input state'); // eslint-disable-line no-console
        elButton.removeAttribute('aria-describedby');
        elInput.setAttribute('value', '');
        elButtonLabel.textContent = '';
      }
    } catch (ex) {
      if (this._debug) console.error(`${this._errorContext}: unexpected error in public function handleUpdateSelectedOption(); Exception:`, ex.message); // eslint-disable-line no-console
    }
  }
}
