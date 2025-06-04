import { moveInstrumentation } from "../../scripts/scripts.js";
import { createlinks } from "../../utils/cta.js";

export default function decorate(block) {
  /* change to ul, li */
  const children = [...block.children];
  const addTitle = children[0];
  const addDescription = children[1];

  // Create a container for the first two children
  const headerWrapper = document.createElement("div");
  headerWrapper.className = "span-container";

  const leftSpan = document.createElement("span");
  leftSpan.className = "left-span";

  if (addTitle) {
    const titleDiv = document.createElement("div");
    titleDiv.className = "title-div lds-garamond-heading-1";
    titleDiv.appendChild(addTitle.cloneNode(true));
    leftSpan.appendChild(titleDiv);
  }

  if (addDescription) {
    const descriptionDiv = document.createElement("div");
    descriptionDiv.className = "description-div";
    descriptionDiv.appendChild(addDescription.cloneNode(true));
    leftSpan.appendChild(descriptionDiv);
  }

  const rightSpan = document.createElement("span");
  rightSpan.className = "right-span";

  const ul = document.createElement("ul");
  ul.className = "item-list";

  children.slice(2).forEach((row) => {
    const li = document.createElement("li");
    li.className = "link-container";
    moveInstrumentation(row, li);

    // Create headline-container
    const headlineContainer = document.createElement("div");
    headlineContainer.className = "headline-container";

    // Create icon-container
    const iconContainer = document.createElement("div");
    iconContainer.className = "icon-container";

    // Add the provided SVG to iconContainer
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <g clip-path="url(#clip0_1408_58442)">
          <path d="M5 16H27" stroke="#191919" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M18 7L27 16L18 25" stroke="#191919" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_1408_58442">
            <rect width="32" height="32" fill="white"/>
          </clipPath>
        </defs>
      </svg>`;
    iconContainer.innerHTML = svgContent;

    // Move all children of row into headlineContainer
    while (row.firstElementChild) {
      headlineContainer.append(row.firstElementChild);
    }

    // Append headlineContainer and iconContainer to linkContainer
    li.appendChild(headlineContainer);
    li.appendChild(iconContainer);

    let ctaLink = null;
    let ctaTarget = null;
    let ctaType = null;
    let ctaAsset = null;
    let ctaAriaLabel = null;

    [...headlineContainer.children].forEach((div, index) => {
      if (index === 0) {
        div.className = "headline";
      } else if (index === 1) {
        ctaType = div.textContent.trim();
        div.remove();
      } else if (index === 2) {
        ctaLink = div.textContent.trim();
        div.remove();
      } else if (index === 3) {
        ctaAsset = div;
        div.remove();
      } else if (index === 4) {
        ctaAriaLabel = div.textContent.trim();
        div.remove();
      } else if (index === 5) {
        ctaTarget = div.textContent.trim();
        div.remove();
      } else if (index === 6) {
        div.remove();
      }
    });

    // Add an <a> tag to the CTA button
    const headlineText = headlineContainer.querySelector(".headline");

    if (headlineText) {
      const links = createlinks({
        label: headlineText.textContent.trim(),
        type: ctaType || "",
        href: ctaLink || "",
        ctaAsset: ctaAsset || null,
        ariaLabel: ctaAriaLabel || "",
        targetPath: ctaTarget || "",
        componentName: "Additional Component",
      });
      if (links) {
        headlineText.textContent = ""; // Clear the original content
        headlineText.appendChild(links); // Wrap the content inside the <a> tag
      }
    }

    ul.append(li);
  });

  rightSpan.appendChild(ul); // Append the ul to the right span

  headerWrapper.appendChild(leftSpan); // Add left span to the header
  headerWrapper.appendChild(rightSpan); // Add right span to the header

  block.textContent = ""; // Clear block content
  block.appendChild(headerWrapper); // Add back the addHeader
}
