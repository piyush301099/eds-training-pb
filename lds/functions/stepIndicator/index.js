export default class LdsStepIndicator {
  // MARK: Constructor
  constructor({
    id,
    steps = [],
    initialStep = 0,
    i8n = {
      step: 'Step',
      of: 'of',
      next: 'Next',
      complete: 'Complete!',
    },
    forceCondensed = false,
  }) {
    if (!steps || !Array.isArray(steps)) {
      throw new Error('ux-lds - StepIndicator: steps (array of strings) is required');
    }

    if (!id || typeof id !== 'string') {
      throw new Error('ux-lds - StepIndicator: id (string) is required');
    }

    if (initialStep < 0 || initialStep > steps.length) {
      throw new Error('ux-lds - StepIndicator: initialStep (number) must be between 0 and totalSteps');
    }

    if (!i8n?.step || !i8n?.of) {
      throw new Error('ux-lds - StepIndicator: i8n (object) is required. Expected shape: { step: "Step", of: "of" }');
    }

    this._id = id;
    this._steps = steps;
    this._stepCount = steps.length;
    this._currentStep = initialStep;
    this._i8n = i8n;
    this._forceCondensed = forceCondensed;
    this._condensedInternal = forceCondensed;
  }

  // MARK: Getters and Setters
  get currentStep() {
    return this._currentStep;
  }

  set currentStep(val) {
    this._currentStep = val;
  }

  // MARK: Class Methods

  // Gets and returns the step indicator element
  getElement() {
    return document.getElementById(this._id);
  }

  // Private function to check width of the element and switch to condensed mode if necessary
  // Large mode should automatically switch to condensed mode if there is not enough room
  #checkElementWidth() {
    const elem = this.getElement();

    const minPillWidth = 144; // 144px is min width of a pill in large mode
    const totalPillWidth = minPillWidth * this._stepCount;

    const pillPadding = 8; // 8px flex gap between pills
    const totalPadding = (this._stepCount - 1) * pillPadding;

    const minimumContainerWidth = totalPillWidth + totalPadding;

    const indicatorWidth = elem.getBoundingClientRect().width;

    if (minimumContainerWidth > indicatorWidth) {
      elem.classList.add('condensed');
      this._condensedInternal = true;
    } else {
      if (this._forceCondensed) return;
      elem.classList.remove('condensed');
      this._condensedInternal = false;
    }

    // Adjust classes and labels if we resize
    this.setStepClasses();
    this.setAriaLabel();
  }

  // Private function to setup a ResizeObserver to watch for screen size changes and call #checkElementWidth()
  #setupResizeObserver() {
    if (this._forceCondensed) {
      const elem = this.getElement();
      elem.classList.add('condensed');
      return;
    }

    window.addEventListener('resize', () => {
      this.#checkElementWidth();
    });
  }

  // Initializes the step indicator. To be called on page load or DOMContentLoaded
  init() {
    this.#checkElementWidth();
    this.#setupResizeObserver();
  }

  // Go to next step.
  next() {
    // final step marked complete is length of the steps array
    if (this._currentStep === this._stepCount) {
      return;
    }

    this._currentStep += 1;
    this.setStepClasses();
    this.setAriaLabel();
  }

  // Go to previous step
  previous() {
    if (this._currentStep <= 0) {
      return;
    }
    this._currentStep -= 1;
    this.setStepClasses();
    this.setAriaLabel();
  }

  setAriaLabel() {
    const elem = this.getElement();
    const isAllComplete = this._currentStep === this._stepCount;

    const condensedCounterLabel = elem.querySelector('.step-count');

    // If the current step is _stepCount we mark the final step as "completed" but should still show the final number of total steps. We don't want "step 10 of 9" when final step is completed.
    const currentLabel = this._currentStep + 1;
    const currentStep = this._currentStep === this._stepCount ? this._stepCount : currentLabel;
    const label = `${this._i8n.step} ${currentStep} ${this._i8n.of} ${this._stepCount}`;

    // Sets the aria-label for current step progress on the main step indicator element
    elem.setAttribute('aria-label', label);
    // sets condensed counter label
    condensedCounterLabel.textContent = `${currentStep} ${this._i8n.of} ${this._stepCount}`;

    // // Sets labels that shows in "condensed mode"
    const condensedLabel = elem.querySelector('.condensed-label');
    const condensedCompleteLabel = elem.querySelector('.condensed-complete-label');
    const condensedNextLabel = elem.querySelector('.condensed-next-label');

    if (this._condensedInternal && isAllComplete) {
      // in condensed mode show the complete label and hide the step label and next label
      condensedLabel.style.display = 'none';
      condensedNextLabel.style.display = 'none';

      condensedCompleteLabel.style.display = 'flex';
    } else if (this._condensedInternal && !isAllComplete) {
      // in condensed mode show the step label and the next label and hide the complete label
      condensedLabel.style.display = 'flex';
      condensedLabel.textContent = this._steps[this._currentStep];

      if (this._currentStep < this._stepCount - 1) {
        condensedNextLabel.style.display = 'flex';
        condensedNextLabel.textContent = `${this._i8n.next}: ${this._steps[this._currentStep + 1]}`;
      } else {
        condensedNextLabel.style.display = 'none';
      }
      condensedCompleteLabel.style.display = 'none';
    }

    if (!this._condensedInternal) {
      condensedLabel.style.display = 'none';
      condensedNextLabel.style.display = 'none';
      condensedCompleteLabel.style.display = 'none';
    }
  }

  setStepClasses() {
    const elem = this.getElement();
    const isAllComplete = this._currentStep === this._stepCount;

    const steps = elem.querySelectorAll('li');
    if (!steps || steps.length !== this._stepCount) {
      throw new Error(`ux-lds - StepIndicator: Incorrect number of steps found in ${this._id}. Expected ${this._stepCount} li elements`);
    }

    steps.forEach((step, index) => {
      // Add 1 because steps are not 0 indexed
      const stepIndex = index;
      const isFinalStepLi = index === this._stepCount - 1;

      const stepLabel = step.querySelector('.step-label');
      if (!stepLabel) {
        throw new Error(`ux-lds - StepIndicator: stepLabel span not found on step ${stepIndex}`);
      }

      if (stepIndex < this._currentStep) {
        // Completed step
        step.classList.add('complete');
        step.classList.remove('active');
      } else if (stepIndex === this._currentStep) {
        // Current step
        step.classList.add('active');
        step.classList.remove('complete');
      } else {
        // Future step
        step.classList.remove('complete');
        step.classList.remove('active');
      }

      // Completed the final step in large mode
      // Show the complete label after completing all steps
      if (isFinalStepLi && isAllComplete && !this._condensedInternal) {
        const completeLabel = step.querySelector('.complete-label');
        completeLabel.style.display = 'flex';
      } else if ((isFinalStepLi && !isAllComplete) || (isFinalStepLi && this._condensedInternal)) {
        // Hide the complete label in the final step if we are either in condensed mode or not all steps are complete
        const completeLabel = step.querySelector('.complete-label');
        completeLabel.style.display = 'none';
      }

      // large mode - hide all step labels if completed the final step
      if (isAllComplete) {
        stepLabel.style.display = 'none';
      } else if (!isAllComplete && !this._condensedInternal) {
        stepLabel.style.display = 'flex';
      }

      // condensed mode - hide step large mode step labels
      if (this._condensedInternal) {
        stepLabel.style.display = 'none';
      }
    });

    // condensed mode - show complete label if completed the final step
    const condensedCompleteLabel = elem.querySelector('.condensed-complete-label');
    if (isAllComplete && this._condensedInternal) {
      condensedCompleteLabel.style.display = 'flex';
    } else {
      condensedCompleteLabel.style.display = 'none';
    }
  }
}
