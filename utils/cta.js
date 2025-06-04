import { decorateIcon } from "../scripts/aem.js";
import pushAdobeAnalyticsEvent from "./analytics/analytics.js";

/**
 * Creates a CTA button element.
 *
 * @param {Object} options - The CTA button options.
 * @param {string} [options.action=''] - Action of CTA,
 * 'navigation' - <a> where we need to navigate to links,
 * 'event-handling' - <button> where we need to handle events on button click.
 * @param {string} [options.type=''] - Type of CTA,
 * 'link' - links,
 * 'asset' - images or pdf.
 * @param {string} [options.variation='cta-button-filled'] - CSS class for styling the button
 * 'cta-button-filled' for filled button,
 * 'cta-text' for text cta.
 * @param {string} [options.label=''] - The visible text of the button.
 * @param {string} [options.href=''] - The URL for navigation (used if type is 'navigation').
 * @param {string} [options.targetPath=''] - 'newTab' , 'sameTab'.
 * @param {Function} [options.onClick] - Click handler (used if type is 'event-handling')
 * @param {boolean} [options.disabled=false] - If true, disables the button.
 * @param {string} [options.ariaLabel=''] - Custom aria-label for accessibility
 * if not provided, the label will be used as the aria-label.
 * @param {string} [options.icon=''] - The icon name - 'arrow-icon'.
 * @param {string} [options.iconPosition='right'] - icon position inside button - 'left','right'.
 * @returns {HTMLElement|null} The CTA button element wrapped in a div, or null if label is missing.
 */
export function createCTAButton({
  action = "",
  type = "",
  variation = "cta-button-filled",
  label = "",
  href = "",
  ctaAsset = null,
  targetPath = "",
  onClick,
  disabled = false,
  ariaLabel = "",
  icon = "",
  iconPosition = "right",
  componentName = "",
} = {}) {
  if (!label) return null;

  let element;
  if (action === "navigation") {
    element = document.createElement("a");
    if (type === "link") {
      element.href = href;
      element.target = targetPath === "newTab" ? "_blank" : "_self";
    } else if (ctaAsset) {
      if (ctaAsset.querySelector("img")) {
        element.href = ctaAsset.querySelector("img").src || "";
      } else if (ctaAsset.querySelector("a")) {
        element.href = ctaAsset.querySelector("a").href || "";
      } else {
        element.href = ctaAsset;
      }
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
  } else if (action === "event-handling") {
    element = document.createElement("button");
    element.type = "button";
    element.disabled = !!disabled;
    if (typeof onClick === "function") {
      element.addEventListener("click", onClick);
    }
  }

  element.textContent = label;
  element.className = variation;
  let ariaValue = ariaLabel !== "" ? ariaLabel : label;
  ariaValue += element.target === "_blank" ? " (opens in new tab)" : "";
  if (element.href?.trim().toLowerCase().endsWith(".pdf")) {
    ariaValue += "(PDF)";
  }
  element.setAttribute("aria-label", ariaValue);
  element.tabIndex = 0;

  // Map required info to clickevents structure
  const eventsData = {
    event: variation === "cta-text" ? "link_click" : "cta_click",
    eventinfo: {
      eventName: variation === "cta-text" ? "link click" : "CTA click",
      linkText: label,
      linkType: variation === "cta-text" ? "link" : "button",
      linkUrl: type === "link" ? href : ctaAsset,
      linkLocation: componentName || "",
      linkLabel: label,
    },
    componentInfo: {
      componentName: componentName || "",
    },
  };
  element.addEventListener("click", () => {
    pushAdobeAnalyticsEvent(eventsData);
  });

  const icons = {
    "arrow-icon": { className: "icon-arrow-right", alt: "arrow-right" },
    "download-icon": {
      className: "icon-download-white",
      alt: "download-white",
    },
  };

  if (icon && icons[icon]) {
    element.classList.add(`cta-icon-${iconPosition}`);
    const iconElement = document.createElement("span");
    iconElement.className = icons[icon].className;
    decorateIcon(iconElement, "", icons[icon].alt);
    iconElement.setAttribute("aria-hidden", "true");
    element.appendChild(iconElement);
  }

  return element;
}

export function createlinks({
  type = "",
  label = "",
  href = "",
  ctaAsset = null,
  targetPath = "",
  ariaLabel = "",
  componentName = "",
} = {}) {
  if (!label) return null;

  const element = document.createElement("a");
  if (type === "link") {
    element.href = href;
    element.target = targetPath === "newTab" ? "_blank" : "_self";
  } else if (ctaAsset) {
    if (ctaAsset.querySelector("img")) {
      element.href = ctaAsset.querySelector("img").src || "";
    } else if (ctaAsset.querySelector("a")) {
      element.href = ctaAsset.querySelector("a").href || "";
    } else {
      element.href = ctaAsset;
    }
    element.target = "_blank";
    element.rel = "noopener noreferrer";
  }

  element.textContent = label;
  let ariaValue = ariaLabel !== "" ? ariaLabel : label;
  ariaValue += targetPath === "newTab" ? " (opens in new tab)" : "";
  if (href?.trim().toLowerCase().endsWith(".pdf")) {
    element.setAttribute("download", "");
    ariaValue += "(PDF)";
  }
  element.setAttribute("aria-label", ariaValue);
  element.setAttribute("role", "link");
  element.tabIndex = 0;

  // Map required info to clickevents structure
  const eventsData = {
    event: "link_click",
    eventinfo: {
      eventName: "link click",
      linkText: label,
      linkType: "link",
      linkUrl: type === "link" ? href : ctaAsset,
      linkLocation: componentName || "",
      linkLabel: label,
    },
    componentInfo: {
      componentName: componentName || "",
    },
  };
  element.addEventListener("click", () => {
    pushAdobeAnalyticsEvent(eventsData);
  });

  return element;
}

/**
 * Creates a social link element and adds an event listener for analytics tracking.
 * @param {HTMLElement} linkElement - The element containing the anchor tag.
 * @param {Array<string>} className - The class name for the social link.
 * @param {string} label - The aria-label for the social link.
 * @param {string} componentName - The name of the AEM component (for analytics tracking).
 * @param {string} linkLocation - The section where the link resides (for analytics tracking).
 * @returns {HTMLElement|null} - The created anchor element or null if not valid.
 */
export function createSocialLink(
  linkElement,
  label,
  componentName = "",
  classNames = [],
) {
  const anchor = linkElement?.querySelector("a");
  if (!anchor) return null;

  anchor.textContent = "";
  anchor.target = "_blank";
  anchor.role = "button";
  anchor.setAttribute("aria-label", `${label} (opens in a new tab)`);
  // Apply all class names from the array to the anchor element
  if (Array.isArray(classNames)) {
    anchor.className = classNames.join(" "); // Join class names with a space
  }

  // Add event listener for analytics tracking
  anchor.addEventListener("click", () => {
    pushAdobeAnalyticsEvent({
      event: "link_click",
      eventinfo: {
        eventName: "Social Click",
        linkText: label, // Pass the button text (e.g., Instagram, LinkedIn)
        linkType: "external", // Social links are typically external
        linkUrl: anchor.href || "", // Destination URL
        linkLocation: componentName || "", // Section where the link resides
        linkLabel: "", // Empty label
        userSelections: "", // Empty user selections
      },
      componentInfo: {
        componentName: componentName || "", // Component name
      },
    });
  });

  return anchor;
}
