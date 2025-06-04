import { createCTAButton } from "../../utils/cta.js";

export default function decorate(block) {
  const child = [...block.children];

  const getTextContent = (el) => el?.textContent.trim() || "";
  const getElement = (el, selector) => el?.querySelector(selector) || null;

  const [
    placement,
    iconImg,
    iconImgAlt,
    eyebrowText,
    title,
    description,
    ctaLabel,
    ctaType,
    ctaLink,
    ctaAsset,
    ctaAriaLabel,
    targetPath,
    exitInterstitial, // eslint-disable-line no-unused-vars
    footnote,
  ] = [
    getTextContent(child[0]),
    getElement(child[1], "img"),
    getTextContent(child[2]),
    getElement(child[3], "p"),
    child[4] || null,
    child[5] || null,
    getTextContent(child[6]),
    getTextContent(child[7]),
    getElement(child[8], "a"),
    child[9] || null,
    getTextContent(child[10]),
    getTextContent(child[11]),
    getTextContent(child[12]),
    child[13] || null,
  ];

  block.textContent = "";

  if (placement) {
    if (placement === "center") {
      block.style.textAlign = "center";
    } else if (placement === "right") {
      block.style.textAlign = "right";
    } else {
      block.style.textAlign = "";
    }
  }

  if (eyebrowText?.textContent.trim()) {
    eyebrowText.classList.add("eyebrow-text");
    eyebrowText.setAttribute("aria-label", eyebrowText.textContent.trim());
    block.append(eyebrowText);
  }

  if (iconImg) {
    iconImg.classList.add("icon-img");
    if (iconImgAlt) {
      iconImg.alt = iconImgAlt;
    }
    block.append(iconImg);
  }

  const titleClassesMap = {
    DIV: ["title"],
    H1: ["fs-normal", "lds-garamond-heading-1"],
    H2: ["fs-normal", "lds-garamond-heading-2"],
    H3: ["fs-normal", "lds-garamond-heading-3"],
    H4: ["fs-normal", "lds-garamond-heading-4"],
    H5: ["fs-normal", "lds-garamond-heading-5"],
    H6: ["fs-normal", "lds-garamond-heading-6"],
    P: ["fs-normal", "lds-garamond-body-large"],
  };

  if (title?.textContent.trim()) {
    const titleClasses = title.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, div",
    );
    titleClasses.forEach((el) => {
      const classes = titleClassesMap[el.tagName.trim()] || [];
      if (classes.length) {
        el.classList.add(...classes);
      }
    });
    title.setAttribute("aria-label", title.textContent.trim());
    block.append(title);
  }

  const descClassesMap = {
    DIV: ["description"],
    H1: ["fs-normal", "lds-ringside-heading-1"],
    H2: ["fs-normal", "lds-ringside-heading-2"],
    H3: ["fs-normal", "lds-ringside-heading-3"],
    H4: ["fs-normal", "lds-ringside-heading-4"],
    H5: ["fs-normal", "lds-ringside-heading-5"],
    H6: ["fs-normal", "lds-ringside-heading-6"],
    P: ["fs-normal", "lds-ringside-body-large"],
    UL: ["fs-normal", "lds-ringside-body-large"],
    OL: ["fs-normal", "lds-ringside-body-large"],
  };

  if (description?.textContent.trim()) {
    const descClasses = description.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, div, ul, ol, a",
    );
    descClasses.forEach((el) => {
      const classes = descClassesMap[el.tagName.trim()] || [];
      if (classes.length) {
        el.classList.add(...classes);
      }
    });
    description.setAttribute("aria-label", description.textContent.trim());
    description.querySelectorAll("a").forEach((anchor) => {
      anchor.tabIndex = 0;
    });
    block.append(description);
  }

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("cta-button");
  if (placement) {
    if (placement === "center") {
      btnContainer.style.justifyContent = "center";
    } else if (placement === "right") {
      btnContainer.style.justifyContent = "flex-end";
    } else {
      btnContainer.style.justifyContent = "";
    }
  }
  const ctaFilledButton = createCTAButton({
    action: "navigation",
    type: ctaType,
    variation: "cta-button-filled",
    label: ctaLabel,
    href: ctaLink ? ctaLink.href : "",
    ctaAsset,
    targetPath,
    ariaLabel: ctaAriaLabel,
    icon: "arrow-icon",
    componentName: "Text Component",
  });
  if (ctaFilledButton) {
    btnContainer.append(ctaFilledButton);
    block.append(btnContainer);
  }

  const footnoteClassesMap = {
    DIV: ["footnote"],
    H1: ["fs-normal", "lds-ringside-heading-1"],
    H2: ["fs-normal", "lds-ringside-heading-2"],
    H3: ["fs-normal", "lds-ringside-heading-3"],
    H4: ["fs-normal", "lds-ringside-heading-4"],
    H5: ["fs-normal", "lds-ringside-heading-5"],
    H6: ["fs-normal", "lds-ringside-heading-6"],
    P: ["fs-normal", "lds-ringside-body-xsmall"],
    UL: ["fs-normal", "lds-ringside-body-xsmall"],
    OL: ["fs-normal", "lds-ringside-body-xsmall"],
  };

  if (footnote?.textContent.trim()) {
    const footnoteClasses = footnote.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, div, a , ul, ol",
    );
    footnoteClasses.forEach((el) => {
      const classes = footnoteClassesMap[el.tagName.trim()] || [];
      if (classes.length) {
        el.classList.add(...classes);
      }
    });
    footnote.setAttribute("aria-label", footnote.textContent.trim());
    block.append(footnote);
  }
}
