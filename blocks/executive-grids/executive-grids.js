import { createOptimizedPicture } from "../../scripts/aem.js";
import { createCTAButton } from "../../utils/cta.js"; // <-- import the CTA button

const generateHTMLSkeleton = ({
  imagePlacement = "",
  imageSrc = "",
  imageAlt = "",
  name = "",
  designation = "",
  ctaLabel = "",
  bioLink = "",
  targetPath = "same tab",
  ariaLabel = "",
}) => {
  const potentialImagePlacement =
    imagePlacement && imagePlacement.toLowerCase() === "top" ? "top" : "left";
  const mainContainer = document.createElement("div");
  mainContainer.className = `profile-card ${potentialImagePlacement}`;

  let imageElement = null;
  if (imageSrc) {
    imageElement = document.createElement("img");
    imageElement.src = imageSrc;
    imageElement.alt = imageAlt || `Photo of ${name}`;
    imageElement.className = "profile-image";
  }

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";

  const divider = document.createElement("div");
  divider.className = "divider";

  const mainContent = document.createElement("div");
  mainContent.className = "main-content";

  const textContent = document.createElement("div");
  textContent.className = "text-content";

  const nameContainer = document.createElement("div");
  nameContainer.className = "name-container";
  nameContainer.textContent = name;

  const designationDiv = document.createElement("div");
  designationDiv.className = "designation";
  designationDiv.textContent = designation;

  const ctaContainer = document.createElement("div");
  ctaContainer.className = "cta-container";

  if (ctaLabel || bioLink) {
    const ctaBtn = createCTAButton({
      action: "navigation",
      type: "link",
      variation: "cta-link",
      label: ctaLabel,
      href: bioLink,
      targetPath:
        targetPath && targetPath.toLowerCase() === "newtab"
          ? "newTab"
          : "sameTab",
      ariaLabel: ariaLabel || ctaLabel,
      componentName: "Executive Grid",
    });
    if (ctaBtn) ctaContainer.appendChild(ctaBtn);
  }

  // text content
  textContent.appendChild(nameContainer);
  textContent.appendChild(designationDiv);

  // main content
  mainContent.appendChild(textContent);
  mainContent.appendChild(ctaContainer);

  // content wrapper
  contentWrapper.appendChild(divider);
  contentWrapper.appendChild(mainContent);

  // Final assembly
  if (imageElement) mainContainer.appendChild(imageElement);
  mainContainer.appendChild(contentWrapper);

  return mainContainer;
};

const extractImageData = (el) => {
  let src = "";
  let alt = "";
  if (el?.innerHTML) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = el.innerHTML;
    const img = tempDiv.querySelector("img");
    if (img) {
      src = img.getAttribute("src") || "";
      alt = img.getAttribute("alt") || "";
    }
  }
  if (el) el.innerHTML = "";
  return { src, alt };
};

const getTrimmedText = (el) => {
  const text = el?.innerText?.trim() || "";
  if (el) el.innerText = "";
  return text;
};

export default function decorate(block) {
  // creating main-container
  const gridContainer = document.createElement("div");
  gridContainer.className = "cards-grid";
  const childElements = Array.from(block.children);
  childElements.forEach((el) => {
    const children = el?.children ? el.children : [];
    const [
      position,
      imagePath,
      name,
      designation,
      ctaLabel,
      bioLink,
      targetPath,
      ariaLabel,
    ] = children;

    const { src: imageSrc, alt: imageAlt } = extractImageData(imagePath);

    const data = {
      imagePlacement: getTrimmedText(position),
      imageSrc,
      imageAlt,
      name: getTrimmedText(name),
      designation: getTrimmedText(designation),
      ctaLabel: getTrimmedText(ctaLabel),
      bioLink: getTrimmedText(bioLink),
      targetPath: getTrimmedText(targetPath),
      ariaLabel: getTrimmedText(ariaLabel),
    };
    // generating html for each card items
    const gridItem = generateHTMLSkeleton(data);
    gridContainer.appendChild(gridItem);
  });

  // Append the grid container to the block
  block.appendChild(gridContainer);
}
