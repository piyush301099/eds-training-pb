import { moveInstrumentation } from "../../scripts/scripts.js";
import { createCTAButton } from "../../utils/cta.js";

export default function decorate(block) {
  const parentContainer = document.createElement("div");
  parentContainer.className = "icon-tile-grid-content";

  const cardsWrapper = document.createElement("div");
  cardsWrapper.className = "icon-grid-content-wrapper";
  const child = [...block.children];

  const siblings = Array.from(block.children);
  siblings.innerHTML = "";
  const rest = siblings;
  const childElements = Array.from(rest);

  const eyebrowWithTitle = document.createElement("div");
  eyebrowWithTitle.className = "section-eyebrow-with-title";
  parentContainer.appendChild(eyebrowWithTitle);

  const getElement = (el, selector) => el?.querySelector(selector) || null;
  const [sectiontitle, columns] = [
    getElement(child[0], "p"),
    child[1] || null,
    child[2] || null,
    getElement(child[3], "p"),
  ];

  if (sectiontitle) {
    sectiontitle.className = "icon-tile-section-title";
    sectiontitle.setAttribute("aria-label", sectiontitle.textContent.trim());
    eyebrowWithTitle.appendChild(sectiontitle);
  }

  const columnsText = columns ? columns.textContent.trim() : "";
  if (columns) {
    columns.style.display = "none";
    if (columnsText === "3-col") {
      cardsWrapper.classList.add("three-columns");
      parentContainer.classList.add("three-columns");
    }
    if (columnsText === "4-col") {
      cardsWrapper.classList.add("four-columns");
      parentContainer.classList.add("four-columns");
    }
  }

  childElements.slice(2).forEach((el) => {
    const children = el?.children ?? [];
    const [
      eyebrowText,
      iconImg,
      title,
      description,
      ctaLabel,
      ctaButtonElement,
      targetPath,
      exitInterstitial,
    ] = children;

    const getTrimmedText = (els) => {
      const text = els?.innerText?.trim() || "";
      if (els) els.innerText = "";
      return text;
    };

    const iconGridItem = document.createElement("div");
    iconGridItem.classList.add("icon-grid-single-item");
    if (columnsText === "3-col") {
      iconGridItem.classList.add("icon-grid-single-item-three-columns");
    }
    if (columnsText === "4-col") {
      iconGridItem.classList.add("icon-grid-single-item-four-columns");
    }
    moveInstrumentation(el, iconGridItem);

    const contentParagraphs = document.createElement("div");
    contentParagraphs.className = "content-paragraphs";
    if (columnsText === "3-col") {
      contentParagraphs.classList.add("content-paragraphs-three-columns");
    }
    if (columnsText === "4-col") {
      contentParagraphs.classList.add("content-paragraphs-four-columns");
    }
    if (eyebrowText) {
      const eyebrowTextDiv = document.createElement("div");
      eyebrowTextDiv.className = "eyebrow-text";
      eyebrowTextDiv.appendChild(eyebrowText);
      iconGridItem.appendChild(eyebrowTextDiv);
    }

    if (iconImg) {
      const img = iconImg.querySelector("img");
      if (img) {
        img.setAttribute("loading", "lazy");
        img.classList.add("icon-grid-image");
      }
      iconGridItem.appendChild(iconImg);
    }

    if (title) {
      const titleClassMap = {
        "3-col": "grid-three-columns-title",
        "4-col": "grid-four-columns-title",
      };
      const titleClass = titleClassMap[columnsText] || "grid-title";
      title.className = titleClass;
      contentParagraphs.appendChild(title);
    }

    if (description) {
      const despClassMap = {
        "3-col": "grid-three-columns-description",
        "4-col": "grid-four-columns-description",
      };
      const despClass = despClassMap[columnsText] || "grid-description";
      description.className = despClass;
      contentParagraphs.appendChild(description);
    }

    const ctaLink = ctaButtonElement?.querySelector("a");
    const href = ctaLink ? ctaLink.href : "";

    const divcta = document.createElement("div");
    divcta.className = "cta-button-wrapper";

    if (ctaLabel?.textContent?.trim()) {
      const ctaFilledButton = createCTAButton({
        action: "navigation",
        type: ctaButtonElement?.textContent?.trim() || "link",
        variation: "cta-link",
        label: ctaLabel.textContent.trim(),
        href,
        targetPath: getTrimmedText(targetPath),
        ariaLabel: ctaLabel.textContent.trim(),
        icon: "",
        componentName: "Icon Tile Component",
        exitInterstitial: exitInterstitial?.textContent.trim() === "true",
      });
      divcta.append(ctaFilledButton);
    }
    iconGridItem.appendChild(contentParagraphs);
    iconGridItem.appendChild(divcta);
    cardsWrapper.appendChild(iconGridItem);
    parentContainer.appendChild(cardsWrapper);
  });

  block.textContent = "";
  block.appendChild(parentContainer);
}
