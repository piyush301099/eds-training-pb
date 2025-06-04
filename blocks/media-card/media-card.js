import { decorateIcon } from "../../scripts/aem.js";
import { moveInstrumentation } from "../../scripts/scripts.js";
import { createCTAButton } from "../../utils/cta.js";

export default function decorate(block) {
  if (block.children.length === 0) return;

  const getTrimmedText = (el) => {
    const text = el?.innerText?.trim() || "";
    if (el) el.innerText = "";
    return text;
  };

  // Convert block.children to an array and destructure
  const childrenArray = Array.from(block.children);
  const [titleitem] = childrenArray; // Get the first child as title
  const title = getTrimmedText(titleitem);
  // Gather links from subsequent rows
  const links = [];
  Array.from(block.children).forEach((row, rowIndex) => {
    if (rowIndex === 0) return;
    const ctaLabel = row.children[0]?.innerText?.trim() || "";
    const ctaType = row.children[1]?.innerText?.trim() || "";
    const ctaLink = row.children[2]?.querySelector("a")?.href
      ? row.children[2].querySelector("a").href
      : ""; // Fixed spacing around '?'
    const ctaAsset = row.children[3];
    const ariaLabel = row.children[4]?.innerText?.trim() || "";
    links.push({
      ctaLabel,
      ctaType,
      ctaLink,
      ctaAsset,
      ariaLabel,
    });
  });

  const mediaCardContainer = document.createElement("div");
  mediaCardContainer.className = "media-card-container";
  const titleContainer = document.createElement("div");
  titleContainer.className = "media-card-title-container";

  const mediaIcon = document.createElement("span");
  mediaIcon.className = "icon-box-arrow";
  decorateIcon(mediaIcon, "", "media-icon");
  titleContainer.appendChild(mediaIcon);
  if (title) {
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;
    titleElement.className = "media-card-title";
    titleElement.setAttribute("aria-label", title);
    titleContainer.appendChild(titleElement);
    moveInstrumentation(block.children[0], titleElement);
  }

  const linksContainer = document.createElement("div");
  linksContainer.className = "media-card-links-container";

  links.forEach((link, i) => {
    const linkDiv = document.createElement("div");
    linkDiv.className = "media-card-link-container";
    const linkItem = createCTAButton({
      action: "navigation", // Fixed spacing before value for key 'action'
      type: link.ctaType || "",
      variation: "cta-text",
      label: link.ctaLabel,
      href: link.ctaLink,
      ctaAsset: link.ctaAsset,
      targetPath: "newTab",
      ariaLabel: link.ariaLabel,
      componentName: "Media Card Component",
    });
    if (linkItem) {
      linkDiv.appendChild(linkItem);
    }
    moveInstrumentation(block.children[i + 1], linkDiv);
    linksContainer.appendChild(linkDiv);
  });

  mediaCardContainer.appendChild(titleContainer);

  mediaCardContainer.appendChild(linksContainer);
  block.textContent = ""; // Clear the block content
  block.appendChild(mediaCardContainer);
}
