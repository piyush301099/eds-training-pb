import { createOptimizedPicture } from "../../scripts/aem.js";
import { moveInstrumentation } from "../../scripts/scripts.js";
import pushAdobeAnalyticsEvent from "../../utils/analytics/analytics.js";

// Helper functions
function addKeyboardAccessibility(element) {
  element.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      element.click();
    }
  });
}

function createTitleWrapper(div, rowIndex) {
  const titleWrapper = document.createElement("div");
  titleWrapper.className = "accordion-header";

  const span = document.createElement("span");
  span.className = "accordion-headline";
  span.innerHTML = div.innerHTML;
  span.setAttribute("tabindex", "0");
  span.setAttribute("role", "button");
  span.setAttribute("aria-expanded", "false");
  span.setAttribute("aria-controls", `accordion${rowIndex + 1}-headline`);
  span.id = `accordion${rowIndex + 1}-headline`;
  addKeyboardAccessibility(span);

  const iconSpan = document.createElement("span");
  iconSpan.className = "accordion-icon";
  iconSpan.setAttribute("tabindex", "0");
  iconSpan.setAttribute("role", "button");
  iconSpan.setAttribute(
    "aria-label",
    `Toggle ${div.textContent.trim()} section`,
  );
  iconSpan.setAttribute("aria-labelledby", `accordion${rowIndex + 1}-headline`);
  addKeyboardAccessibility(iconSpan);

  const iconImg = document.createElement("span");
  iconImg.innerHTML = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
<path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11 14L16 19L21 14" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
  iconImg.setAttribute("aria-hidden", "true");
  iconSpan.appendChild(iconImg);

  titleWrapper.appendChild(span);
  titleWrapper.appendChild(iconSpan);
  div.replaceWith(titleWrapper);

  return titleWrapper;
}

function createContentDiv(div, className, rowIndex = null) {
  // Convert className to kebab-case if not already
  const kebabClass = className
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
  const contentDiv = document.createElement("div");
  contentDiv.className = `${kebabClass} content`;
  contentDiv.innerHTML = div.innerHTML;
  if (rowIndex !== null) contentDiv.id = `content-${rowIndex}`;
  div.replaceWith(contentDiv);
  return contentDiv;
}

function createImageDiv(div, imageTitleDiv) {
  const imageDiv = document.createElement("div");
  imageDiv.className = "image";
  const picture = document.createElement("img");
  picture.setAttribute("src", div?.textContent.trim());

  if (picture) {
    imageDiv.appendChild(picture);
    div.replaceWith(imageDiv);

    const imageDivFin = document.createElement("div");
    imageDivFin.className = "image-div-fin content";

    if (imageTitleDiv) imageDivFin.appendChild(imageTitleDiv);
    imageDivFin.appendChild(imageDiv);

    return imageDivFin;
  }
  return null;
}

function toggleAccordionState(li, itemsDiv, rowIndex, defaultBehavior) {
  const contentElements = li.querySelectorAll(".content");
  const isActive =
    defaultBehavior === "all" ||
    (defaultBehavior === "first" && rowIndex === 0);

  contentElements.forEach((content) => {
    content.style.display = isActive ? "" : "none";
  });

  li.classList.toggle("active", isActive);
  itemsDiv
    .querySelector(".accordion-headline")
    .setAttribute("aria-expanded", isActive);
  li.setAttribute("aria-expanded", isActive);
}

function handleAccordionClick(event) {
  const clickedItem = event.target.closest(".items");
  if (
    !clickedItem ||
    event.target.tagName === "A" ||
    event.target.closest("a")
  ) {
    return;
  }

  const parentLi = clickedItem.closest(".accordion-item");
  if (parentLi) {
    const contentElements = parentLi.querySelectorAll(".content");
    const isExpanded = parentLi.classList.contains("active");

    contentElements.forEach((content) => {
      content.style.display = isExpanded ? "none" : "";
    });

    parentLi.classList.toggle("active", !isExpanded);
    parentLi.setAttribute("aria-expanded", !isExpanded);

    const title = clickedItem.querySelector(".accordion-headline");
    if (title) title.setAttribute("aria-expanded", !isExpanded);

    const icon = clickedItem.querySelector(".accordion-icon");
    if (icon) icon.setAttribute("aria-expanded", !isExpanded);

    // Push event to adobeDataLayer when accordion is opened
    if (!isExpanded) {
      const accordionName = title ? title.textContent.trim() : "";
      const eventData = {
        event: "cta_click",
        eventinfo: {
          eventName: "Accordion Open",
          linkText: accordionName, // Pass the accordion title
          linkType: "", // No specific link type
          linkUrl: "", // No destination URL
          linkLocation: "Accordion Section", // Section name where the accordion resides
          linkLabel: "", // Empty label
          userSelections: "", // Empty user selections
        },
        componentInfo: {
          componentName: "Accordion Component", // Component name
        },
      };
      pushAdobeAnalyticsEvent(eventData);
    }
  }
}

function optimizeImages(ul) {
  ul.querySelectorAll("picture > img").forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: "750" },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector("img"));
    img.closest("picture").replaceWith(optimizedPic);
  });
}

function createImageLabel(div) {
  const imageLabelDiv = div.cloneNode(true);
  imageLabelDiv.className = "image-label";

  const iconSpan = document.createElement("span");
  iconSpan.className = "image-label-icon";
  iconSpan.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
    <path d="M12.5 21.75C14.4284 21.75 16.3134 21.1782 17.9168 20.1068C19.5202 19.0355 20.7699 17.5127 21.5078 15.7312C22.2458 13.9496 22.4389 11.9892 22.0627 10.0979C21.6864 8.20655 20.7579 6.46927 19.3943 5.10571C18.0307 3.74215 16.2934 2.81355 14.4021 2.43734C12.5108 2.06114 10.5504 2.25422 8.76883 2.99217C6.98725 3.73013 5.46451 4.97981 4.39317 6.58319C3.32182 8.18657 2.75 10.0716 2.75 12C2.75273 14.585 3.78083 17.0634 5.60872 18.8913C7.43661 20.7192 9.91497 21.7473 12.5 21.75ZM8.21937 9.96937C8.28903 9.89964 8.37174 9.84432 8.46279 9.80658C8.55384 9.76883 8.65143 9.74941 8.75 9.74941C8.84856 9.74941 8.94615 9.76883 9.0372 9.80658C9.12825 9.84432 9.21097 9.89964 9.28062 9.96937L12.5 13.1897L15.7194 9.96937C15.7891 9.89969 15.8718 9.84442 15.9628 9.8067C16.0539 9.76899 16.1515 9.74958 16.25 9.74958C16.3485 9.74958 16.4461 9.76899 16.5372 9.8067C16.6282 9.84442 16.7109 9.89969 16.7806 9.96937C16.8503 10.0391 16.9056 10.1218 16.9433 10.2128C16.981 10.3039 17.0004 10.4015 17.0004 10.5C17.0004 10.5985 16.981 10.6961 16.9433 10.7872C16.9056 10.8782 16.8503 10.9609 16.7806 11.0306L13.0306 14.7806C12.961 14.8504 12.8782 14.9057 12.7872 14.9434C12.6962 14.9812 12.5986 15.0006 12.5 15.0006C12.4014 15.0006 12.3038 14.9812 12.2128 14.9434C12.1217 14.9057 12.039 14.8504 11.9694 14.7806L8.21937 11.0306C8.14964 10.961 8.09432 10.8783 8.05658 10.7872C8.01883 10.6962 7.99941 10.5986 7.99941 10.5C7.99941 10.4014 8.01883 10.3038 8.05658 10.2128C8.09432 10.1217 8.14964 10.039 8.21937 9.96937Z" fill="#D31710"/>
    </svg>`;
  iconSpan.setAttribute("aria-hidden", "true");
  const containerDiv = document.createElement("div");
  containerDiv.className = "image-label-container";
  containerDiv.setAttribute("role", "button");
  containerDiv.setAttribute("tabindex", "0");
  containerDiv.setAttribute("aria-expanded", "false");
  containerDiv.setAttribute("aria-label", "Toggle image label description");
  containerDiv.appendChild(imageLabelDiv);
  containerDiv.appendChild(iconSpan);

  containerDiv.addEventListener("click", () => {
    iconSpan.classList.toggle("rotated");
  });

  return containerDiv;
}

function createImageDescription(div) {
  const extendedDescDiv = div.cloneNode(true);
  extendedDescDiv.className = "image-description";
  extendedDescDiv.style.display = "none";
  const children = extendedDescDiv.querySelectorAll("p,li");
  children.forEach((element) => {
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "article");
    element.setAttribute("aria-label", `${element.textContent.trim()}`);
  });

  const links = extendedDescDiv.querySelectorAll("a");
  links.forEach((element) => {
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "link");
    element.setAttribute("aria-label", `${element.textContent.trim()}`);
  });

  return extendedDescDiv;
}

export default function decorate(block) {
  const children = [...block.children];
  const accTitle = children[0];
  const dataBehavior = children[1];
  const defaultAccordionBehavior =
    dataBehavior?.textContent?.trim().toLowerCase() || "none";
  const headerWrapper = document.createElement("div");
  headerWrapper.className = "accordion-title-main";
  if (accTitle) {
    headerWrapper.innerHTML = accTitle.innerHTML;
  }
  block.textContent = "";
  block.appendChild(headerWrapper);

  const ul = document.createElement("ul");
  ul.className = "default-accordion";

  children.slice(2).forEach((row, rowIndex) => {
    const li = document.createElement("li");
    li.className = "accordion-item";
    li.id = `accordion${rowIndex + 1}`;
    moveInstrumentation(row, li);

    const itemsDiv = document.createElement("div");
    itemsDiv.className = "items";

    let imageTitleDiv = null;
    let imageLabelDiv = null;
    let extendedDescDiv = null;
    let imageDiv = null;

    [...row.children].forEach((div, index) => {
      if (index === 0) {
        const titleWrapper = createTitleWrapper(div, rowIndex);
        itemsDiv.appendChild(titleWrapper);
      } else if (index === 1) {
        const descriptionDiv = createContentDiv(
          div,
          "accordion-body",
          rowIndex,
        );
        itemsDiv.appendChild(descriptionDiv);
      } else if (index === 2) {
        imageTitleDiv = createContentDiv(div, "image-title");
      } else if (index === 3) {
        imageDiv = createImageDiv(div, imageTitleDiv);
        li.appendChild(imageDiv);
      } else if (index === 4) {
        imageLabelDiv = createImageLabel(div);
      } else if (index === 5) {
        extendedDescDiv = createImageDescription(div);
      }
    });

    if (imageDiv && (imageLabelDiv || extendedDescDiv)) {
      const labelDescContainer = document.createElement("div");
      labelDescContainer.className = "image-label-desc-container";
      if (imageLabelDiv) labelDescContainer.appendChild(imageLabelDiv);
      if (extendedDescDiv) labelDescContainer.appendChild(extendedDescDiv);
      imageDiv.appendChild(labelDescContainer);

      if (imageLabelDiv && extendedDescDiv) {
        imageLabelDiv.addEventListener("click", () => {
          const isVisible = extendedDescDiv.style.display !== "none";
          extendedDescDiv.style.display = isVisible ? "none" : "";
          extendedDescDiv.setAttribute("aria-hidden", isVisible);
          imageLabelDiv.setAttribute("aria-expanded", !isVisible);
          // Push event to adobeDataLayer when accordion is opened
          if (!isVisible) {
            const expandbleName = imageLabelDiv
              ? imageLabelDiv.textContent.trim()
              : "";
            const eventData = {
              event: "cta_click",
              eventinfo: {
                eventName: "Accordion Open",
                linkText: expandbleName, // Pass the accordion title
                linkType: "", // No specific link type
                linkUrl: "", // No destination URL
                linkLocation: "Image Expandable Section", // Section name where the accordion resides
                linkLabel: "", // Empty label
                userSelections: "", // Empty user selections
              },
              componentInfo: {
                componentName: "Accordion Component", // Component name
              },
            };
            pushAdobeAnalyticsEvent(eventData);
          }
        });

        imageLabelDiv.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            imageLabelDiv.click();
          }
        });
      }
    }

    li.prepend(itemsDiv);
    ul.appendChild(li);

    toggleAccordionState(li, itemsDiv, rowIndex, defaultAccordionBehavior);
  });

  ul.addEventListener("click", handleAccordionClick);

  optimizeImages(ul);

  block.appendChild(ul);
}
