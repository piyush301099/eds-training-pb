/**
 * Pushes an event into Adobe Analytics via adobeDataLayer.
 * @param {object} eventData - Additional data to include with the event.
 */
export default function pushAdobeAnalyticsEvent(eventData = {}) {
  if (!window.adobeDataLayer) {
    return;
  }

  // Push the event into adobeDataLayer
  window.adobeDataLayer.push(eventData);
}
