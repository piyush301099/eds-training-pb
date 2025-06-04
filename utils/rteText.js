import pushAdobeAnalyticsEvent from "./analytics/analytics.js";

export default function decorateRteText(rteContent) {
  rteContent.classList.add("richtext-field-wrapper");

  rteContent.querySelectorAll("a").forEach((link) => {
    link.ariaLabel = link.textContent.trim();
    link.tabIndex = 0;
    link.classList.add("rte-link");
    const externalSuffix = "_NEW_TAB";
    if (link.href.toUpperCase().includes(externalSuffix)) {
      link.href = link.href.slice(0, -externalSuffix.length - 1);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.ariaLabel += " (opens in new tab)";
    }

    const eventsData = {
      event: "link_click",
      eventinfo: {
        eventName: "Link Click",
        linkText: link.textContent.trim(),
        linkType: "link",
        linkUrl: link.href || "",
        linkLocation: "",
        linkLabel: link.textContent.trim(),
      },
      componentInfo: {
        componentName: "Link link",
      },
    };
    rteContent.addEventListener("click", () => {
      pushAdobeAnalyticsEvent(eventsData);
    });
  });

  return rteContent;
}
