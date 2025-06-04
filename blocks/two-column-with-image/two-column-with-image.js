import { createCTAButton } from "../../utils/cta.js";

export default function decorate(block) {
  const childElements = [...block.children];

  const getTextContent = (el) => el?.textContent.trim() || "";
  const getElement = (el, selector) => el?.querySelector(selector) || null;

  const [
    placement,
    image,
    imageAlt,
    iconImg,
    iconImgAlt,
    title,
    description,
    ctaTypeField,
    ctaLabel,
    ctaType,
    ctaLink,
    ctaAsset,
    ctaAriaLabel,
    targetPath,
  ] = [
    getTextContent(childElements[0]),
    getElement(childElements[1], "img"),
    getTextContent(childElements[2]),
    getElement(childElements[3], "img"),
    getTextContent(childElements[4]),
    getTextContent(childElements[5]),
    childElements[6] || null,
    getTextContent(childElements[7]),
    getTextContent(childElements[8]),
    getTextContent(childElements[9]),
    getTextContent(childElements[10]),
    childElements[11],
    getTextContent(childElements[12]),
    getTextContent(childElements[13]),
  ];
  block.textContent = "";
  const twoColumnContainer = document.createElement("div");
  twoColumnContainer.className = "two-column-container";
  const contentArea = document.createElement("div");
  contentArea.className = "two-column-content-area";

  if (iconImg) {
    iconImg.classList.add("icon-img");
    if (iconImgAlt) {
      iconImg.alt = iconImgAlt;
    }
    contentArea.append(iconImg);
  }

  if (title) {
    const titleElement = document.createElement("h2");
    titleElement.textContent = title;
    titleElement.className = "two-column-title lds-garamond-heading-2";
    titleElement.setAttribute("aria-label", title);
    contentArea.appendChild(titleElement);
  }

  if (description) {
    description.className = "two-column-description lds-ringside-body-medium";
    description.setAttribute("aria-label", description.textContent.trim());
    contentArea.appendChild(description);
  }

  const ctaFilledButton = createCTAButton({
    action: "navigation",
    type: ctaType,
    variation: ctaTypeField === "textLink" ? "cta-text" : "cta-button-filled",
    label: ctaLabel,
    href: ctaLink,
    ctaAsset,
    targetPath,
    ariaLabel: ctaAriaLabel,
    icon: ctaTypeField === "textLink" ? "" : "arrow-icon",
    componentName: "Two Column with Image Component",
  });
  if (ctaFilledButton) {
    contentArea.append(ctaFilledButton);
  }
  const imageArea = document.createElement("div");
  if (image) {
    imageArea.className = "two-column-image-area";
    if (imageAlt) {
      image.alt = imageAlt;
    }
    imageArea.appendChild(image);
  }

  if (window.matchMedia("(max-width: 950px)").matches) {
    twoColumnContainer.appendChild(imageArea);
    twoColumnContainer.appendChild(contentArea);
  } else if (placement === "right") {
    twoColumnContainer.appendChild(contentArea);
    twoColumnContainer.appendChild(imageArea);
  } else {
    twoColumnContainer.appendChild(imageArea);
    twoColumnContainer.appendChild(contentArea);
  }

  block.appendChild(twoColumnContainer);
}
