import { createCTAButton } from "../../utils/cta.js";
/* eslint-disable */
import handleKalturaPlayer from "../../utils/video.js";

function createDivWrapper(p) {
  const innerDiv = document.createElement("div");
  innerDiv.appendChild(p);

  const outerDiv = document.createElement("div");
  outerDiv.appendChild(innerDiv);

  return outerDiv;
}

function normalizeBlock(block, tagCount) {
  const allPTags = Array.from(block.querySelectorAll("p"));
  const structure = new Array(tagCount).fill(undefined);

  for (let i = 0; i < allPTags.length && i < tagCount; i++) {
    structure[i] = allPTags[i];
  }

  for (let i = 0; i < tagCount; i++) {
    if (!structure[i]) {
      const p = document.createElement("p");
      p.textContent = "";
      if (i === 0 || i === 1) {
        p.style.display = "none";
      }
      if (i === 2) {
        p.textContent = "false";
        p.style.display = "none";
      }
      if (i === 13) {
        p.classList.add("hero-title");
      }
      if (i === 14) {
        p.classList.add("hero-description");
      }

      const wrapper = createDivWrapper(p);
      block.appendChild(wrapper);

      structure[i] = p;
    } else {
      if (i === 0 || i === 1) {
        structure[i].style.display = "none";
      }
      if (i === 2) {
        const text = structure[i].textContent.trim().toLowerCase();
        if (text === "true" || text === "false") {
          structure[i].style.display = "none";
        }
      }
      if (i === 13) {
        structure[i].classList.add("hero-title");
        structure[i].style.display = "";
      }
      if (i === 14) {
        structure[i].classList.add("hero-description");
        structure[i].style.display = "";
      }
    }
  }

  return structure;
}

function showDownIconArrow(gettrueorfalse, block) {
  const herotitle = document.querySelector(".hero-title");
  const herodescription = document.querySelector(".hero-description");

  const iconContainer = document.createElement("div");
  iconContainer.className = "hero-icon-container";
  if (gettrueorfalse === "true") {
    iconContainer.classList.remove("hidden");
  } else {
    iconContainer.classList.add("hidden");
  }

  const icon = document.createElement("i");
  icon.className = "icon-external";
  icon.setAttribute("aria-hidden", "true");

  iconContainer.appendChild(icon);

  let insertAfterElement = null;

  if (herodescription) {
    let outerMostDiv = herodescription.closest("div");
    while (
      outerMostDiv.parentElement &&
      outerMostDiv.parentElement.children.length === 1
    ) {
      outerMostDiv = outerMostDiv.parentElement;
    }
    insertAfterElement = outerMostDiv;
  } else if (herotitle) {
    let outerMostDiv = herotitle.closest("div");
    while (
      outerMostDiv.parentElement &&
      outerMostDiv.parentElement.children.length === 1
    ) {
      outerMostDiv = outerMostDiv.parentElement;
    }
    insertAfterElement = outerMostDiv;
  }

  if (insertAfterElement?.parentNode) {
    insertAfterElement.parentNode.insertBefore(
      iconContainer,

      insertAfterElement.nextSibling,
    );
  }
  block.appendChild(iconContainer);
}

function processBlock(block) {
  const child = [...block.children];

  const getElement = (el, selector) => el?.querySelector(selector) || null;

  const [
    backgroundType,
    backgroundImg,
    backgroundImgAlt,
    backgroundVideo,
    enableOverlay,
    overlayTitle,
    iconImg,
    iconImgAlt,
    textColor,
    ctaLabel,
    ctaButtonElement,
    targetPath,
    exitInterstitial,
    title,
    description,
  ] = [
    getElement(child[0], "p"),
    getElement(child[1], "img"),
    getElement(child[2], "p"),
    getElement(child[3], "p"),
    getElement(child[4], "p"),
    getElement(child[5], "p"),

    getElement(child[6], "img"),
    getElement(child[7], "p"),

    getElement(child[8], "p"),

    getElement(child[9], "p"),
    getElement(child[10], "a"),
    getElement(child[11], "p"),
    getElement(child[12], "p"),

    getElement(child[13], "p"),
    getElement(child[14], "p"),
  ];

  if (backgroundType) backgroundType.style.display = "none";
  if (backgroundImg) backgroundImg.style.display = "none";
  if (backgroundImgAlt) backgroundImgAlt.style.display = "none";
  if (backgroundVideo) backgroundVideo.style.display = "none";
  if (enableOverlay) enableOverlay.style.display = "none";
  if (overlayTitle) overlayTitle.style.display = "none";
  if (iconImg) iconImg.style.display = "none";
  if (iconImgAlt) iconImgAlt.style.display = "none";
  if (textColor) textColor.style.display = "none";
  if (ctaLabel) ctaLabel.style.display = "none";
  if (ctaButtonElement) ctaButtonElement.style.display = "none";
  if (targetPath) targetPath.style.display = "none";
  if (exitInterstitial) exitInterstitial.style.display = "none";
  if (title) title.classList.add("hero-title");
  if (description) description.classList.add("hero-description");

  if (backgroundVideo) {
    initiateKaltura(block, backgroundVideo);
  }

  if (enableOverlay && overlayTitle) {
    if (enableOverlay.textContent.trim() === "false") {
      enableOverlay.style.display = "none";
      overlayTitle.style.display = "none";
      showOverlay("false", overlayTitle, block, backgroundType);
    } else {
      enableOverlay.style.display = "none";
      overlayTitle.style.display = "none";

      showOverlay(
        enableOverlay.textContent.trim(),
        overlayTitle,
        block,
        backgroundType,
      );

      showDownIconArrow(enableOverlay.textContent.trim(), block);
    }
  } else if (enableOverlay) {
    enableOverlay.style.display = "none";
  }

  if (block) {
    const childDivs = Array.from(block.children).filter(
      (child) => child.tagName === "DIV",
    );

    let heroImageTitleFound = false;

    childDivs.forEach((div) => {
      if (heroImageTitleFound) return;

      const pictureTags = div.querySelectorAll("picture");

      pictureTags.forEach((picture) => picture.remove());

      const heroImageTitle = div.querySelector(".hero-title");
      if (heroImageTitle) {
        heroImageTitleFound = true;
      }
    });

    const paragraphs = block.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const hasTagInside = Array.from(p.childNodes).some(
        (node) => node.nodeType === 1,
      );
      if (hasTagInside) {
        p.remove();
      }
    });
  }

  if (title?.textContent?.trim()) {
    title.classList.add("hero-title");
    title.setAttribute("aria-label", title.textContent.trim());
  }

  if (description?.textContent?.trim()) {
    description.classList.add("hero-description");
    description.setAttribute("aria-label", description.textContent.trim());

    description.querySelectorAll?.("a").forEach((anchor) => {
      anchor.tabIndex = 0;
    });

    if (description?.textContent?.trim()) {
      description.classList.add("hero-image-description");
      description.setAttribute("aria-label", description.textContent.trim());

      description.querySelectorAll?.("a").forEach((anchor) => {
        anchor.tabIndex = 0;
      });
    }
  }
}

function getSelectTypeId(block) {
  const paragraphs = normalizeBlock(block, 1);
  const firstPTag = paragraphs[0];

  if (firstPTag) {
    const textContent = firstPTag.textContent.trim();
    if (textContent === "imageSlide" || textContent === "videoSlide") {
      return firstPTag;
    }
  }

  console.error('First <p> tag does not contain "imageSlide" or "videoSlide".');
  return null;
}

function limitCardsToFour() {
  const heroBlocks = document.querySelectorAll(".hero");
  heroBlocks.forEach((heroBlock) => {
    const gridContainer = heroBlock.querySelector(".icon-grid-container");
    if (gridContainer) {
      const gridItems = gridContainer.querySelectorAll(".icon-grid-item");
      gridItems.forEach((item, index) => {
        if (index >= 4) {
          item.remove();
        }
      });
    }
  });
}

function showOverlay(value, title, block, backgroundType) {
  if (!block) return;

  let overlay = block.querySelector(".video-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "video-overlay";
  }
  title?.removeAttribute("style");
  title?.classList.add("overlay-title", "overlay-text");
  title.setAttribute("aria-label", title.textContent.trim());
  overlay.appendChild(title);

  const container =
    block.querySelector(".hero-image-container") ||
    block.querySelector(".hero-image-text-wrapper-old") ||
    block.querySelector(".primary-hero-video");

  if (!container) {
    console.warn("hero-image-container not found");
    return;
  }

  const containerParent = container.parentElement;
  const siblings = Array.from(containerParent.children);
  const containerIndex = siblings.indexOf(container);

  if (containerIndex === -1) {
    console.warn("hero-image-container not found in its parent");
    return;
  }

  const iconBlocks = [];

  for (let i = 0; i < containerIndex; i++) {
    const el = siblings[i];

    if (el.tagName === "DIV") {
      const innerDivs = Array.from(el.children);
      const hasPicture = innerDivs.some((child) =>
        child.querySelector("picture"),
      );
      const textDivs = innerDivs.filter((child) => child.querySelector("p"));
      const hasTextDivs = textDivs.length >= 1;

      if (hasPicture && hasTextDivs) {
        el.classList.add("icon-grid-item");
        iconBlocks.push(el);

        textDivs.forEach((div) => {
          const paragraph = div.querySelector("p");
          if (paragraph) {
            if (!div.hasAttribute("aria-label")) {
              div.setAttribute("aria-label", paragraph.textContent.trim());
            }
          }
        });
      }
    }
  }

  let cardsWrapper = overlay.querySelector(".icon-grid-container");
  if (!cardsWrapper) {
    cardsWrapper = document.createElement("div");
    cardsWrapper.className = "icon-grid-container";
  }

  cardsWrapper.innerHTML = "";

  iconBlocks.forEach((div) => cardsWrapper.appendChild(div));

  const indicatorsContainer = document.createElement("div");
  indicatorsContainer.classList.add("carousel-indicators");
  overlay.appendChild(cardsWrapper);
  overlay.appendChild(indicatorsContainer);

  if (!overlay.parentElement) {
    if (container.nextSibling) {
      containerParent.insertBefore(overlay, container.nextSibling);
    } else {
      containerParent.appendChild(overlay);
    }
  }

  if (value === "false") {
    cardsWrapper.classList.add("icon-grid-container-padding-removed");
    const overlaytitle = overlay.querySelector(".overlay-title");
    if (overlaytitle) {
      overlaytitle.classList.add("icon-grid-container-padding-removed");
    }
  }

  let videoStateBeforeScroll = true;
  function handleScroll(heroBlock, overlay, container) {
    const iconContainerDownArrow = heroBlock?.querySelector(
      ".hero-icon-container",
    );
    const herotitle = heroBlock?.querySelector(".hero-title");
    const herodescription = heroBlock?.querySelector(".hero-description");

    const rect = block.getBoundingClientRect();
    const isOutOfView = rect?.top < 0;
    const isBackToTop = rect?.top >= 0;

    if (backgroundType.textContent.trim() === "imageSlide") {
      const iconimg = container.querySelector(".icon-img");
      const heroimagetitle = container.querySelector(".hero-image-title");
      const heroimagedescription = container.querySelector(
        ".hero-image-description",
      );
      const ctaButton = container.querySelector(
        ".cta-button-hero-image-banner",
      );
      if (
        isOutOfView &&
        !overlay.classList.contains("show") &&
        value === "true"
      ) {
        limitCardsToFour();

        overlay.classList.add("show");
        cardsWrapper.classList.remove("icon-grid-container-padding-removed");
        const overlaytitle = overlay.querySelector(".overlay-title");
        if (overlaytitle) {
          overlaytitle.classList.remove("icon-grid-container-padding-removed");
        }

        overlay.style.width = "100%";
        if (iconimg) {
          iconimg.classList.add("hidden");
        }
        heroimagetitle?.classList.add("hidden");
        heroimagedescription?.classList.add("hidden");
        ctaButton?.classList.add("hidden");
        iconContainerDownArrow?.classList.add("hidden");
      }

      if (isBackToTop && overlay.classList.contains("show")) {
        overlay.classList.remove("show");

        cardsWrapper.classList.add("icon-grid-container-padding-removed");
        const overlaytitle = overlay.querySelector(".overlay-title");
        if (overlaytitle) {
          overlaytitle.classList.add("icon-grid-container-padding-removed");
        }

        overlay.style.width = "0%";
        if (iconimg) {
          iconimg.classList.remove("hidden");
        }
        heroimagetitle?.classList.remove("hidden");
        heroimagedescription?.classList.remove("hidden");
        ctaButton?.classList.remove("hidden");
        iconContainerDownArrow?.classList.remove("hidden");
      }
    } else {
      let videoElementforoverlay = heroBlock?.querySelector(".playkit-engine");

      const classKaltura = heroBlock?.querySelector(".primary-hero-video");

      if (!videoElementforoverlay) return;

      const rect = block.getBoundingClientRect();
      const isOutOfView = rect.top < 0;
      const isBackToTop = rect.top >= 0;

      if (
        isOutOfView &&
        !overlay.classList.contains("show") &&
        value === "true"
      ) {
        videoStateBeforeScroll = !videoElementforoverlay.paused;

        videoElementforoverlay.pause();
        limitCardsToFour();

        overlay.classList.add("show");
        overlay.style.width = "100%";
        herotitle?.classList.add("hidden");
        herodescription?.classList.add("hidden");
        iconContainerDownArrow?.classList.add("hidden");
        removeKalturaThumbnail(classKaltura);
      }

      if (isBackToTop && overlay.classList.contains("show")) {
        overlay.classList.remove("show");
        overlay.style.width = "0%";
        if (videoStateBeforeScroll) {
          videoElementforoverlay.play();
        } else {
          videoElementforoverlay.pause();
        }

        herotitle?.classList.remove("hidden");
        herodescription?.classList.remove("hidden");
        iconContainerDownArrow?.classList.remove("hidden");
        removeKalturaThumbnail(classKaltura);
      }

      window.addEventListener("load", () => {
        if (heroBlock) {
          setTimeout(() => {
            const heroBlockPosition =
              heroBlock.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: heroBlockPosition, behavior: "smooth" });
          }, 0);

          overlay.classList.remove("show");
          overlay.style.width = "0%";

          if (videoElementforoverlay) {
            videoElementforoverlay.play().catch((error) => {
              console.warn("Video playback failed:", error);
            });
          }

          if (herotitle) {
            herotitle.classList.remove("hidden");
          }
          if (herodescription) {
            herodescription.classList.remove("hidden");
          }
        }
      });

      function detectVideoElement(heroBlock, overlay, container) {
        videoElementforoverlay = document.querySelector(".playkit-engine");
        if (videoElementforoverlay) {
          window.addEventListener(
            "scroll",
            handleScroll(heroBlock, overlay, container),
          );
          handleScroll(heroBlock, overlay, container);
        } else {
          setTimeout(detectVideoElement(heroBlock, overlay, container), 100);
        }
      }

      setTimeout(() => {
        detectVideoElement(heroBlock, overlay, container);
      }, 100);
    }
  }

  window.addEventListener("scroll", () =>
    handleScroll(block, overlay, container),
  );

  function updateIndicators(cardsWrapper, indicatorsContainer) {
    const cards = cardsWrapper.querySelectorAll(".icon-grid-item");
    if (!cards.length) return;

    const card = cards[0];
    const cardWidth =
      card.offsetWidth +
      Number.parseInt(getComputedStyle(card).marginRight || 0);
    const { scrollLeft } = cardsWrapper;
    const currentIndex = Math.round(scrollLeft / cardWidth);

    const indicators = indicatorsContainer.querySelectorAll(".indicator");

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  }

  function createIndicators(heroBlock) {
    limitCardsToFour();
    const indicatorsContainer = heroBlock.querySelector(".carousel-indicators");
    const cardsWrapper = heroBlock.querySelector(".icon-grid-container");

    if (!indicatorsContainer || !cardsWrapper) return;

    indicatorsContainer.innerHTML = "";

    const cards = cardsWrapper.querySelectorAll(".icon-grid-item");

    if (cards.length < 2) {
      indicatorsContainer.style.display = "none";
      return;
    }

    cards.forEach((_, index) => {
      const indicator = document.createElement("div");
      indicator.classList.add("indicator");

      if (index === 0) {
        indicator.classList.add("active");
      }

      indicator.addEventListener("click", () => {
        const cardWidth =
          cards[0].offsetWidth +
          Number.parseInt(getComputedStyle(cards[0]).marginRight || 0);
        cardsWrapper.scrollTo({
          left: index * cardWidth,
          behavior: "smooth",
        });
      });

      indicatorsContainer.appendChild(indicator);
    });

    indicatorsContainer.style.display = "flex";

    // Attach scroll event to update indicators
    cardsWrapper.addEventListener("scroll", () => {
      updateIndicators(cardsWrapper, indicatorsContainer);
    });
  }

  function enableSwipe(cardsWrapper, indicatorsContainer) {
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;

    cardsWrapper.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startX = e.touches[0].clientX;
      isSwiping = true;
    });

    cardsWrapper.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    });

    cardsWrapper.addEventListener("touchend", () => {
      if (!isSwiping) return;
      isSwiping = false;

      const cards = cardsWrapper.querySelectorAll(".icon-grid-item");
      if (!cards.length) return;

      const cardWidth =
        cards[0].offsetWidth +
        Number.parseInt(getComputedStyle(cards[0]).marginRight || 0);
      const { scrollLeft } = cardsWrapper;
      let currentIndex = Math.round(scrollLeft / cardWidth);

      const deltaX = startX - currentX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentIndex < cards.length - 1) {
          currentIndex++;
        } else if (deltaX < 0 && currentIndex > 0) {
          currentIndex--;
        }
      }

      const targetScrollLeft = currentIndex * cardWidth;
      cardsWrapper.scrollTo({
        left: targetScrollLeft,
        behavior: "smooth",
      });

      setTimeout(
        () => updateIndicators(cardsWrapper, indicatorsContainer),
        300,
      );
    });
  }

  createIndicators(block);
  enableSwipe(cardsWrapper, indicatorsContainer);
}

function processedImageBlock(block) {
  const child = [...block.children];

  const getElement = (el, selector) => el?.querySelector(selector) || null;

  const divContainer = document.createElement("div");
  divContainer.className = "hero-image-container";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "content-wrapper";

  divContainer.appendChild(contentWrapper);
  block.append(divContainer);

  const [
    backgroundType,
    backgroundImg,
    backgroundImgAlt,
    backgroundVideo,
    enableOverlay,
    overlayTitle,
    iconImg,
    iconImgAlt,
    textColor,
    ctaLabel,
    ctaType,
    ctaLink,
    ctaAsset,
    widthMediaAriaLabel,
    targetPath,
    exitInterstitial,
    title,
    description,
  ] = [
    getElement(child[0], "p"),

    getElement(child[1], "img"),
    getElement(child[2], "p"),

    getElement(child[3], "p"),
    getElement(child[4], "p"),
    getElement(child[5], "p"),

    getElement(child[6], "img"),
    getElement(child[7], "p"),

    getElement(child[8], "p"),

    getElement(child[9], "p"),
    getElement(child[10], "p"),
    getElement(child[11], "a"),
    child[12],

    getElement(child[13], "p"),
    getElement(child[14], "p"),
    getElement(child[15], "p"),
    getElement(child[16], "p"),
    getElement(child[17], "p"),
  ];

  backgroundType.style.display = "none";

  if (backgroundVideo) {
    backgroundVideo.style.display = "none";
  }

  if (enableOverlay && overlayTitle) {
    if (enableOverlay.textContent.trim() === "false") {
      enableOverlay.style.display = "none";
      overlayTitle.style.display = "none";
      showOverlay("false", overlayTitle, block, backgroundType);
      const overlay = document.querySelector(".video-overlay");
      if (overlay) {
        overlay.remove();
      }
    } else {
      enableOverlay.style.display = "none";
      overlayTitle.style.display = "none";

      showOverlay(
        enableOverlay.textContent.trim(),
        overlayTitle,
        block,
        backgroundType,
      );

      const iconContainer = document.createElement("div");
      iconContainer.className = "hero-icon-container";

      const icon = document.createElement("i");
      const color = textColor?.textContent?.trim()?.toLowerCase();

      if (!color || color === "white") {
        icon.className = "icon-external";
      } else {
        icon.className = "icon-external-black";
      }

      iconContainer.appendChild(icon);
      divContainer.appendChild(iconContainer);

      const overlay = block.querySelector(".video-overlay");

      const overlaytitle = overlay.querySelector(".overlay-title");
      if (overlaytitle) {
        overlaytitle.classList.add("icon-grid-container-padding-removed");
      }
      const cardsWrapper = overlay.querySelector(".icon-grid-container");
      cardsWrapper.classList.add("icon-grid-container-padding-removed");
    }
  } else if (enableOverlay) {
    enableOverlay.style.display = "none";
  }

  if (backgroundImg) {
    backgroundImg.classList.add("background-img");
    if (backgroundImgAlt) {
      backgroundImg.alt = backgroundImgAlt.textContent.trim();
      backgroundImgAlt.style.display = "none";
    }

    backgroundImg.onerror = () => {
      backgroundImg.style.display = "none";
    };

    divContainer.appendChild(backgroundImg);
  } else {
    if (backgroundImgAlt) {
      backgroundImgAlt.style.display = "none";
    }
  }

  if (iconImg) {
    iconImg.classList.add("icon-img");
    if (iconImgAlt) {
      iconImg.alt = iconImgAlt.textContent.trim();
      iconImgAlt.style.display = "none";
    }
    iconImg.onerror = () => {
      iconImg.style.display = "none";
    };
    contentWrapper.appendChild(iconImg);
  } else {
    if (iconImgAlt) {
      iconImgAlt.style.display = "none";
    }
  }

  if (textColor) {
    textColor.style.display = "none";
  }

  if (ctaLabel) ctaLabel.style.display = "none";

  if (ctaButtonElement) ctaButtonElement.style.display = "none";

  if (targetPath) targetPath.style.display = "none";

  if (exitInterstitial) exitInterstitial.style.display = "none";

  if (title?.textContent?.trim()) {
    title.classList.add("hero-image-title");
    title.setAttribute("aria-label", title.textContent.trim());

    // if (ctaButtonElement) ctaButtonElement.style.display = 'none'

    if (color === "white") {
      title.classList.add("hero-image-title-white");
    } else {
      title.classList.add("hero-image-title-black");
    }

    contentWrapper.appendChild(title);
  }

  if (description?.textContent?.trim()) {
    description.classList.add("hero-image-description");
    description.setAttribute("aria-label", description.textContent.trim());

    description.querySelectorAll?.("a").forEach((anchor) => {
      anchor.tabIndex = 0;
    });

    const color = textColor?.textContent?.trim() || "white";
    if (color === "white") {
      description.classList.add("hero-image-title-white");
    } else {
      description.classList.add("hero-image-title-black");
    }

    if (backgroundType.textContent.trim() === "imageSlide") {
      contentWrapper.appendChild(description);
    } else {
      const outerDiv = child[14];
      const innerDiv = outerDiv?.firstElementChild;

      if (innerDiv && description) {
        innerDiv.appendChild(description);
      } else {
        contentWrapper.appendChild(description);
      }
    }
  }

  if (ctaLabel?.textContent?.trim()) {
    const ctaButton = document.createElement("a");
    ctaButton.className = "button cta-link";

    const labelText = ctaLabel.textContent.trim();
    ctaButton.textContent = labelText;
    ctaButton.setAttribute("aria-label", `${labelText} button`);

    if (ctaButtonElement?.href) {
      ctaButton.setAttribute("href", ctaButtonElement.href);
    }

    ctaButton.tabIndex = 0;

    const targetText = targetPath?.textContent?.trim();
    ctaButton.target = targetText === "newTab" ? "_blank" : "_self";

    if (ctaLabel?.textContent?.trim()) {
      const btnContainer = document.createElement("div");
      btnContainer.classList.add("cta-button-hero-image-banner");

      const ctaButton = createCTAButton({
        action: "navigation",
        type: ctaType?.textContent.trim(),
        variation: "cta-button-filled",
        label: ctaLabel?.textContent.trim(),
        href: ctaLink?.href || "",
        ariaLabel: widthMediaAriaLabel?.textContent.trim(),
        ctaAsset,
        targetPath: targetPath?.textContent?.trim(),
        icon: "arrow-icon",
        componentName: "Hero Banner Component",
      });
      if (ctaButton) {
        btnContainer.appendChild(ctaButton);

        contentWrapper.appendChild(btnContainer);
      }
    }
  }
  const BLOCKED_CLASSES = ["playkit-hover", "playkit-state-paused"];
  const FORCE_CLASS = "force-cursor-visible";
  const POLL_INTERVAL = 300;

  const interval = setInterval(() => {
    const container = document.getElementById(playerId);
    if (!container) return;

    const player = container.querySelector(".playkit-player");
    if (!player) return;

    const videoElement = document.querySelector(".playkit-engine");
    if (videoElement) {
      videoElement.setAttribute("aria-label", "background video");
    }

    cleanClasses(player);

    if (!player.classList.contains(FORCE_CLASS)) {
      player.classList.add(FORCE_CLASS);
    }

    patchClassList(player);
    patchClassNameProperty(player);

    clearInterval(interval);
  }, POLL_INTERVAL);

  function cleanClasses(el) {
    BLOCKED_CLASSES.forEach((cls) => {
      if (el.classList.contains(cls)) {
        el.classList.remove(cls);
      }
    });

    if (!el.classList.contains(FORCE_CLASS)) {
      el.classList.add(FORCE_CLASS);
    }
  }

  function patchClassList(el) {
    if (el.__patchedClassList) return;

    const originalAdd = el.classList.add;
    const originalToggle = el.classList.toggle;
    const originalRemove = el.classList.remove;

    el.classList.add = function (...classes) {
      const filtered = classes.filter((cls) => {
        if (BLOCKED_CLASSES.includes(cls)) {
          return false;
        }
        return true;
      });
      if (filtered.length > 0) {
        originalAdd.apply(this, filtered);
      }
    };

    el.classList.toggle = function (cls, force) {
      if (BLOCKED_CLASSES.includes(cls)) {
        return this.contains(cls);
      }
      return originalToggle.call(this, cls, force);
    };

    el.classList.remove = function (...classes) {
      const filtered = classes.filter((cls) => {
        if (cls === FORCE_CLASS) {
          return false;
        }
        return true;
      });
      if (filtered.length > 0) {
        originalRemove.apply(this, filtered);
      }
    };

    el.__patchedClassList = true;
  }

  function patchClassNameProperty(el) {
    if (el.__patchedClassName) return;

    const descriptor =
      Object.getOwnPropertyDescriptor(Element.prototype, "className") ||
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, "className");

    Object.defineProperty(el, "className", {
      get() {
        return descriptor.get.call(this);
      },
      set(newValue) {
        let classes = newValue.split(/\s+/).filter(Boolean);

        classes = classes.filter((cls) => !BLOCKED_CLASSES.includes(cls));

        if (!classes.includes(FORCE_CLASS)) {
          classes.push(FORCE_CLASS);
        }

        const finalValue = classes.join(" ");
        descriptor.set.call(this, finalValue);
      },
      configurable: true,
      enumerable: true,
    });

    el.__patchedClassName = true;
  }
}
function initiateKaltura(block, backgroundVideo) {
  const playerId = `kaltura-${Date.now()}-${Math.floor(
    Math.random() * 1000000,
  )}`;

  if (!backgroundVideo) {
    console.warn("No video ID element found in hero block.");
    return;
  }

  const videoId = backgroundVideo.textContent.trim();
  backgroundVideo.style.display = "none";

  const videoPlayerContainer = document.createElement("div");
  videoPlayerContainer.id = playerId;
  videoPlayerContainer.classList.add("primary-hero-video");
  block.appendChild(videoPlayerContainer);
  handleKalturaPlayer(videoId, playerId);
  setupKalturaPlayerControl(playerId);
  updateAriaLabelsForKaltura(playerId);
}

function updateAriaLabelsForKaltura(playerId) {
  const CONTROL_BUTTON_CLASS = "playkit-control-button";
  const POLL_INTERVAL = 300;
  const MAX_ATTEMPTS = 20;
  let attempts = 0;

  const interval = setInterval(() => {
    attempts++;

    const container = document.getElementById(playerId);
    if (!container) return;

    const controlButtons = container.querySelectorAll(
      `.${CONTROL_BUTTON_CLASS}`,
    );
    if (controlButtons.length === 0) {
      if (attempts >= MAX_ATTEMPTS) {
        clearInterval(interval);
      }
      return;
    }

    controlButtons.forEach(patchAriaLabelSetter);

    clearInterval(interval);
  }, POLL_INTERVAL);

  function patchAriaLabelSetter(el) {
    if (el.__patchedAriaLabel) return;

    const originalSetAttribute = el.setAttribute;
    el.setAttribute = function (attr, value) {
      let _value;
      if (attr === "aria-label") {
        _value = normalizeAriaLabel(value);
      }
      return originalSetAttribute.call(this, attr, _value);
    };

    const descriptor = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "ariaLabel",
    );
    if (descriptor?.set) {
      Object.defineProperty(el, "ariaLabel", {
        get() {
          return descriptor.get.call(this);
        },
        set(value) {
          descriptor.set.call(this, normalizeAriaLabel(value));
        },
        configurable: true,
        enumerable: true,
      });
    }

    const currentLabel = el.getAttribute("aria-label");
    if (currentLabel) {
      el.setAttribute("aria-label", normalizeAriaLabel(currentLabel));
    }

    el.__patchedAriaLabel = true;
  }

  function normalizeAriaLabel(label) {
    if (!label) return label;

    if (label.trim().startsWith("Pause")) return "Pause";
    if (label.trim().startsWith("Play")) return "Play";

    return label;
  }
}

function removeKalturaThumbnail(playerSelector) {
  const BLOCKED_CLASSES = [
    "playkit-floating-poster-show",
    "playkit-floating-active",
  ];

  let container;

  if (typeof playerSelector === "string") {
    container = document.querySelector(`.${playerSelector}`);
  } else if (playerSelector instanceof HTMLElement) {
    container = playerSelector;
  }

  if (!container) return;

  const posterEl = container.querySelector(".playkit-floating-poster");
  const floatingEl = container.querySelector(".playkit-floating-container");

  if (posterEl) {
    cleanClasses(posterEl);
    removeStyleIfPosterShown(posterEl);
    patchClassList(posterEl);
    patchClassNameProperty(posterEl);
    setupMutationObserver(posterEl, true);
  }

  if (floatingEl) {
    cleanClasses(floatingEl);
    removeStyleAlways(floatingEl);
    patchClassList(floatingEl);
    patchClassNameProperty(floatingEl);
    setupMutationObserver(floatingEl, false);
  }

  function cleanClasses(el) {
    BLOCKED_CLASSES.forEach((cls) => {
      if (el.classList.contains(cls)) {
        el.classList.remove(cls);
      }
    });
  }

  function removeStyleIfPosterShown(el) {
    if (el.classList.contains("playkit-floating-poster-show")) {
      el.removeAttribute("style");
    }
  }

  function removeStyleAlways(el) {
    el.removeAttribute("style");
  }

  function patchClassList(el) {
    if (el.__patchedClassList) return;

    const originalAdd = el.classList.add;
    const originalToggle = el.classList.toggle;
    const originalRemove = el.classList.remove;

    el.classList.add = function (...classes) {
      const filtered = classes.filter((cls) => !BLOCKED_CLASSES.includes(cls));
      if (filtered.length > 0) {
        originalAdd.apply(this, filtered);
      }
    };

    el.classList.toggle = function (cls, force) {
      if (BLOCKED_CLASSES.includes(cls)) {
        return this.contains(cls);
      }
      return originalToggle.call(this, cls, force);
    };

    el.classList.remove = function (...classes) {
      originalRemove.apply(this, classes);
    };

    el.__patchedClassList = true;
  }

  function patchClassNameProperty(el) {
    if (el.__patchedClassName) return;

    const descriptor =
      Object.getOwnPropertyDescriptor(Element.prototype, "className") ||
      Object.getOwnPropertyDescriptor(HTMLElement.prototype, "className");

    Object.defineProperty(el, "className", {
      get() {
        return descriptor.get.call(this);
      },
      set(newValue) {
        let classes = newValue.split(/\s+/).filter(Boolean);
        classes = classes.filter((cls) => !BLOCKED_CLASSES.includes(cls));
        const finalValue = classes.join(" ");
        descriptor.set.call(this, finalValue);
      },
      configurable: true,
      enumerable: true,
    });

    el.__patchedClassName = true;
  }

  function setupMutationObserver(el, isPoster) {
    const observer = new MutationObserver(() => {
      cleanClasses(el);

      if (isPoster) {
        removeStyleIfPosterShown(el);
      } else {
        removeStyleAlways(el);
      }
    });

    observer.observe(el, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });
  }
}

function handleRemoveThumbnail() {
  const classKaltura = document.querySelector(".primary-hero-video");
  removeKalturaThumbnail(classKaltura);
}

export default function decorate(block) {
  const selectTypeId = getSelectTypeId(block);
  if (!selectTypeId) {
    console.warn("No select type ID element found in hero block.");
    return;
  }

  const selectType = selectTypeId.textContent.trim();
  if (selectType === "imageSlide") {
    block.parentElement?.parentElement?.classList.add("image-slide");
    block.parentElement?.classList.add("image-wrapper-slide");
    processedImageBlock(block);
  } else {
    block.parentElement?.parentElement?.classList.remove("image-slide");
    block.parentElement?.classList.remove("image-wrapper-slide");
    initiateKaltura(block);
    processBlock(block);

    window.addEventListener("scroll", handleRemoveThumbnail);
  }
}
