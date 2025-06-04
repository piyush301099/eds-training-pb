import { createCTAButton } from "../../utils/cta.js";

export default function decorate(block) {
  // Destructure children as variables
  const [
    textAlignment,
    eyebrowText,
    highlightedtextColor,
    title,
    description,
    ctaLabel,
    ctaType,
    ctaLink,
    ctaAsset,
    ariaLabel,
    targetPath,
    // exitInterstitial,
  ] = block.children;

  // Clear block content
  block.innerHTML = "";

  // Create wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "promo-banner-wrapper";

  // Create container with alignment styles
  const container = document.createElement("div");
  container.className = "promo-banner-container";

  function getAlignItemsValue(align) {
    if (!align) return "center";
    const val = align.toLowerCase();
    if (val === "left") return "start";
    if (val === "right") return "end";
    if (val === "center") return "center";
    return "center";
  }

  // Helper to create accessible, focusable text elements
  function createAccessibleElement(tag, className, text, html = false) {
    const el = document.createElement(tag);
    el.className = className;
    if (html) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
    el.setAttribute("tabindex", "0");
    return el;
  }

  // Set alignment styles
  if (textAlignment?.textContent.trim()) {
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.alignItems = getAlignItemsValue(
      textAlignment.textContent.trim(),
    );
    container.style.textAlign = textAlignment.textContent || "left";
    container.style.justifyContent = textAlignment.textContent || "left";
  }

  // Eyebrow
  if (eyebrowText?.textContent.trim()) {
    container.appendChild(
      createAccessibleElement("span", "pb-eyebrow", eyebrowText.textContent),
    );
  }

  // Title
  if (title?.innerHTML.trim()) {
    const titleEl = createAccessibleElement(
      "div",
      "pb-title",
      title.innerHTML,
      true,
    );
    titleEl.setAttribute("aria-label", "Promo Title");
    // Remove all highlight classes before adding new one
    titleEl.querySelectorAll("i, em, u").forEach((el) => {
      el.classList.remove(
        "pb-highlight-primary",
        "pb-highlight-secondary",
        "pb-highlight-tertiary",
      );
    });
    // Highlight italic and underline with textColor
    const color = highlightedtextColor?.textContent.trim();
    if (color) {
      titleEl.querySelectorAll("i, em, u").forEach((el) => {
        el.classList.add(`pb-highlight-${color}`);
      });
    }
    container.appendChild(titleEl);
  }

  // Description
  if (description?.innerHTML.trim()) {
    const descEl = createAccessibleElement(
      "div",
      "pb-description",
      description.innerHTML,
      true,
    );
    descEl.setAttribute("aria-label", "Promo Description");
    container.appendChild(descEl);
  }

  // CTA Button
  if (ctaLabel?.textContent.trim() && ctaLink && ctaLink.textContent.trim()) {
    const ctaButton = createCTAButton({
      action: "navigation",
      type: ctaType.textContent.trim(),
      variation: "cta-button-filled",
      label: ctaLabel.textContent.trim(),
      href: ctaLink.textContent.trim(),
      ariaLabel: ariaLabel?.textContent.trim(),
      ctaAsset,
      targetPath: targetPath?.textContent.trim(),
      icon: "arrow-icon",
      componentName: "Promo Banner Component",
    });
    if (ctaButton) {
      container.appendChild(ctaButton);
    }
  }

  wrapper.appendChild(container);
  block.appendChild(wrapper);
}
