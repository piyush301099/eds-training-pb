export default function getFocusableElements(element) {
  if (!element) {
    // eslint-disable-next-line no-console
    console.error('LDS ERROR [Usage]: getFocusableElements function requires an element parameter of type HTMLElement which must be a valid DOM element');
    return [];
  }

  try {
    const elements = element.querySelectorAll(`
      a[href]:not([disabled]):not([tabindex="-1"]),
      button:not([disabled]):not([tabindex="-1"]),
      textarea:not([disabled]):not([tabindex="-1"]),
      input:not([disabled]):not([type="hidden"]):not([tabindex="-1"]),
      select:not([disabled]):not([tabindex="-1"]),
      .lds-focusable,
      [tabindex]:not([tabindex="-1"]),
      iframe:not([tabindex="-1"]),
      [contentEditable=true]:not([tabindex="-1"])`);

    return Array.from(elements).filter((el) => el.offsetHeight > 0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('LDS ERROR [Unexpected Failure]: Failed to getFocusableElements from DOM element:', element);
    return [];
  }
}
