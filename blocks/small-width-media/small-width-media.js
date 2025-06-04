import { createCTAButton } from "../../utils/cta.js";

export default function decorate(block) {
  // Extract children before clearing
  const childElements = [...block.children];

  // Helper functions
  const getTextContent = (el) => el?.textContent.trim() || "";
  const getElement = (el, selector) => el?.querySelector(selector) || null;

  // Extracting the fields
  const eyebrowtext = getTextContent(childElements[0]);
  const textalignment = getTextContent(childElements[1]);
  const img = getElement(childElements[2], "img");
  const alt = getTextContent(childElements[3]);
  const title = getTextContent(childElements[4]);
  const description = getTextContent(childElements[5]);
  const ctaLabel = getTextContent(childElements[6]);
  const ctaType = getTextContent(childElements[7]);
  const ctaLink = getTextContent(childElements[8]);
  const ctaAsset = childElements[9];
  const ctaAriaLabel = getTextContent(childElements[10]);
  const targetPath = getTextContent(childElements[11]);
  // const exitInterstitial = getTextContent(childElements[12]);
  const backgroundverticalposition = getTextContent(childElements[13]);
  const backgroundhorizontalposition = getTextContent(childElements[14]);

  // Get image url and alt from <img> inside <picture> (usually childElements[2])
  let imageUrl = "";
  let imageAlt = "";

  if (img) {
    imageUrl = img.getAttribute("src") || "";
    imageAlt = alt || "";
  }

  // Clear block content
  block.innerHTML = "";

  // Create container with background image
  const smallwidthmediaContainer = document.createElement("div");
  smallwidthmediaContainer.className = "smallwidthmedia-container";
  if (imageUrl) {
    smallwidthmediaContainer.style.backgroundImage = `url('${imageUrl}')`;
    smallwidthmediaContainer.style.backgroundPositionX =
      backgroundhorizontalposition || "center";
    smallwidthmediaContainer.style.backgroundPositionY =
      backgroundverticalposition || "center";

    if (imageAlt) {
      const srOnly = document.createElement("span");
      srOnly.className = "sr-only";
      srOnly.textContent = imageAlt;
      smallwidthmediaContainer.appendChild(srOnly);
    }
  }

  // SVG overlay
  const svgOverlay = document.createElement("div");
  svgOverlay.className = "smallwidthmedia-svg-overlay";
  svgOverlay.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1088" height="581" viewBox="0 0 1088 581" fill="none">
      <path opacity="0.8" d="M0 0L1090 0V581L0 581L0 0Z" fill="url(#paint0_linear_3693_147143)" fill-opacity="0.8"/>
      <defs>
        <linearGradient id="paint0_linear_3693_147143" x1="1090" y1="831.799" x2="0" y2="831.799" gradientUnits="userSpaceOnUse">
          <stop stop-opacity="0"/>
          <stop offset="1"/>
        </linearGradient>
      </defs>
    </svg>
  `;

  // Helper to map text alignment to align-items value
  function getAlignItemsValue(align) {
    if (!align) return "center";
    const val = align.toLowerCase();
    if (val === "left") return "start";
    if (val === "right") return "end";
    if (val === "center") return "center";
    return "center";
  }

  // Helper to create accessible, focusable text elements
  function createAccessibleElement(tag, className, text) {
    const el = document.createElement(tag);
    el.className = className;
    el.textContent = text;
    el.setAttribute("tabindex", "0");
    return el;
  }

  // Create content wrapper
  const contentdiv = document.createElement("div");
  contentdiv.className = "smallwidthmedia-content-div";
  contentdiv.style.textAlign = textalignment || "center";
  contentdiv.style.alignItems = getAlignItemsValue(textalignment);
  contentdiv.style.justifyContent = textalignment || "center";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "smallwidthmedia-content";
  contentWrapper.style.textAlign = textalignment || "center";
  contentWrapper.style.alignItems = getAlignItemsValue(textalignment);
  contentWrapper.style.justifyContent = textalignment || "center";

  // Eyebrow text (use semantic tag for accessibility)
  if (eyebrowtext) {
    contentWrapper.appendChild(
      createAccessibleElement("span", "smallwidthmedia-eyebrow", eyebrowtext),
    );
  }

  // Title (focusable and accessible)
  if (title) {
    contentWrapper.appendChild(
      createAccessibleElement("h2", "smallwidthmedia-title", title),
    );
  }

  // Description (focusable and accessible)
  if (description) {
    contentWrapper.appendChild(
      createAccessibleElement("p", "smallwidthmedia-description", description),
    );
  }

  // CTA Button after description
  const ctaBtn = createCTAButton({
    action: "navigation",
    type: ctaType,
    variation: "cta-button-filled",
    label: ctaLabel,
    href: ctaLink,
    ctaAsset,
    targetPath,
    ariaLabel: ctaAriaLabel,
    icon: "arrow-icon",
    componentName: "Small width Media Component",
  });
  if (ctaBtn) {
    contentWrapper.appendChild(ctaBtn);
  }
  contentdiv.appendChild(contentWrapper);
  contentdiv.appendChild(svgOverlay);
  smallwidthmediaContainer.appendChild(contentdiv);
  block.appendChild(smallwidthmediaContainer);
}
