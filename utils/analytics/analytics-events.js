/**
 * Represents the structure of an analytics event.
 * @typedef {Object} Eventinfo
 * @property {string} eventName - The name of the event.
 * @property {string} linkText - The text of the link associated with the event.
 * @property {string} linkType - The type of the link (e.g., internal, external).
 * @property {string} linkUrl - The URL of the link.
 * @property {string} linkLocation - The location of the link on the page.
 * @property {string} linkLabel - The label associated with the link.
 */
const eventinfo = {
  eventName: "",
  linkText: "",
  linkType: "",
  linkUrl: "",
  linkLocation: "",
  linkLabel: "",
};

/**
 * An object representing information about a component.
 * @typedef {Object} ComponentInfo
 * @property {string} componentName - The name of the component.
 */
const componentInfo = {
  componentName: "",
};

/**
 * Object representing click event analytics data.
 * @typedef {Object} ClickEvents
 * @property {string} event - The name of the event.
 * @property {Object} eventinfo - Information about the event.
 * @property {Object} componentInfo - Information about the component associated with the event.
 */
const clickevents = {
  event: "",
  eventinfo,
  componentInfo,
};

export default clickevents;
