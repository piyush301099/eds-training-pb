import { moveInstrumentation } from "../../scripts/scripts.js";
import { createCTAButton } from "../../utils/cta.js";

export default function decorate(block) {
  const container = document.createElement("div");
  container.className = "additional-resource-card-tile";

  const siblings = Array.from(block.children);
  siblings.innerHTML = "";
  const rest = siblings;

  const childElements = Array.from(rest);

  const getTrimmedText = (el) => {
    const text = el?.innerText?.trim() || "";
    if (el) el.innerText = "";
    return text;
  };

  function createAndAppendElement(parent, sourceElement, className) {
    if (sourceElement) {
      const div = document.createElement("div");
      div.className = className;
      div.textContent = sourceElement;
      parent.appendChild(div);
    }
  }

  childElements.forEach((el) => {
    const children = el?.children ? el.children : [];
    const [
      iconImg,
      title,
      description,
      ctaLabel,
      ctaButtonElement,
      targetPath,
      exitInterstitial,
    ] = children;
    if (
      childElements.length === 1 &&
      children.length === 1 &&
      children[0].tagName === "DIV" &&
      children[0].children.length === 0
    ) {
      container.remove();
      return;
    }

    const cardsWrapper = document.createElement("div");
    cardsWrapper.className = "additional-resource-card-section-wrapper";
    cardsWrapper.innerHTML = "";
    moveInstrumentation(el, cardsWrapper);

    const storyGridarea = document.createElement("div");
    storyGridarea.className = "additional-resource-card-item";

    const tileArea = document.createElement("div");
    tileArea.className = "additional-resource-card-content-area";

    const leftCol = document.createElement("div");
    leftCol.className = "additional-resource-card-left-col";

    const midPartCol = document.createElement("div");
    midPartCol.className = "additional-resource-card-midpart";

    const divider = document.createElement("div");
    divider.className = "additional-resource-card-divider";
    midPartCol.appendChild(divider);

    const additionalcontents = document.createElement("div");
    additionalcontents.className = "additional-resource-card-midpart-contents";
    midPartCol.appendChild(additionalcontents);

    const midCol = document.createElement("div");
    midCol.className = "additional-resource-card-middle-col";

    const storyFeedTitlecontain = document.createElement("div");
    storyFeedTitlecontain.className = "additional-resource-card-title-section";

    if (iconImg) {
      const img = iconImg.querySelector("img");
      if (img?.src) {
        img.classList.add("icon-img");
        leftCol.appendChild(img.cloneNode(true));
      }
    }

    if (title) {
      createAndAppendElement(
        storyFeedTitlecontain,
        getTrimmedText(title),
        "additional-resource-card-title",
      );
    }

    if (description) {
      createAndAppendElement(
        midCol,
        getTrimmedText(description),
        "additional-resource-card-description",
      );
    }

    const ctaLink = ctaButtonElement?.querySelector("a");
    const href = ctaLink ? ctaLink.href : "";

    if (ctaLabel?.textContent?.trim()) {
      const divcta = document.createElement("div");
      divcta.className = "cta-button-wrapper";
      const ctaFilledButton = createCTAButton({
        action: "navigation",
        type: "link",
        variation: "cta-link",
        label: ctaLabel.textContent.trim(),
        href,
        targetPath: getTrimmedText(targetPath),
        ariaLabel: ctaLabel.textContent.trim(),
        icon: "",
        componentName: "Story Feed Component",
        exitInterstitial: exitInterstitial?.textContent.trim() === "true",
      });
      divcta.append(ctaFilledButton);
      midCol.appendChild(divcta);
    }

    tileArea.appendChild(leftCol);

    additionalcontents.appendChild(storyFeedTitlecontain);
    additionalcontents.appendChild(midCol);

    tileArea.appendChild(midPartCol);

    storyGridarea.appendChild(tileArea);
    cardsWrapper.appendChild(storyGridarea);
    container.appendChild(cardsWrapper);
  });

  block.textContent = "";
  block.appendChild(container);
}
