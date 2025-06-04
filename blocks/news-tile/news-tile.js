import { decorateIcon } from "../../scripts/aem.js";
import { moveInstrumentation } from "../../scripts/scripts.js";
import { createCTAButton } from "../../utils/cta.js";

export default async function decorate(block) {
  const children = [...block.children];

  block.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "carousel-wrapper";

  children.forEach((tile) => {
    // Map children to fields by name for clarity
    const [
      eyebrowText,
      newsTileTitle,
      date,
      description,
      ctaLabel,
      ctaType,
      ctaLink,
      ctaAsset,
      newsTileAriaLabel,
      targetPath,
      exitInterstitial, // eslint-disable-line no-unused-vars
    ] = tile?.children ? tile.children : [];

    const tileWrapper = document.createElement("div");
    tileWrapper.className = "newstile-item-container";
    moveInstrumentation(tile, tileWrapper);

    if (window.matchMedia("(max-width: 768px)").matches) {
      // Mobile: Eyebrow and Date together
      if (eyebrowText || date) {
        const eyebrowDateWrapper = document.createElement("div");
        eyebrowDateWrapper.className = "newstile-eyebrow-date-wrapper";

        if (eyebrowText && eyebrowText.textContent.trim() !== "") {
          const eyebrowDiv = document.createElement("div");
          eyebrowDiv.className = "newstile-eyebrow";
          eyebrowDiv.textContent = eyebrowText.textContent.trim();
          eyebrowDateWrapper.appendChild(eyebrowDiv);
          moveInstrumentation(eyebrowText, eyebrowDiv);
        }

        if (date) {
          const dateDiv = document.createElement("div");
          dateDiv.className = "newstile-date";
          const rawDate = date.textContent.trim();
          const parsedDate = new Date(rawDate);
          if (!Number.isNaN(parsedDate.getTime())) {
            const formattedDate = new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(parsedDate);
            dateDiv.textContent = formattedDate;
          }
          eyebrowDateWrapper.appendChild(dateDiv);
        }

        if (eyebrowDateWrapper.childNodes.length > 0) {
          tileWrapper.appendChild(eyebrowDateWrapper);
        }
      }

      // Title after eyebrow/date
      if (newsTileTitle) {
        const titleDiv = document.createElement("div");
        titleDiv.className = "newstile-title";
        titleDiv.textContent = newsTileTitle.textContent.trim();
        tileWrapper.appendChild(titleDiv);
      }
    } else {
      // Desktop: Eyebrow, then Title, then Date
      if (eyebrowText && eyebrowText.textContent.trim() !== "") {
        const eyebrowDiv = document.createElement("div");
        eyebrowDiv.className = "newstile-eyebrow";
        eyebrowDiv.textContent = eyebrowText.textContent.trim();
        tileWrapper.appendChild(eyebrowDiv);
        moveInstrumentation(eyebrowText, eyebrowDiv);
      }

      if (newsTileTitle) {
        const titleDiv = document.createElement("div");
        titleDiv.className = "newstile-title";
        titleDiv.textContent = newsTileTitle.textContent.trim();
        tileWrapper.appendChild(titleDiv);
      }

      if (date) {
        const dateDiv = document.createElement("div");
        dateDiv.className = "newstile-date";
        const rawDate = date.textContent.trim();
        const parsedDate = new Date(rawDate);
        if (!Number.isNaN(parsedDate.getTime())) {
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }).format(parsedDate);
          dateDiv.textContent = formattedDate;
        }
        tileWrapper.appendChild(dateDiv);
      }
    }

    // ...existing code...

    // Description
    if (description.textContent.trim() !== "") {
      const descriptionDiv = document.createElement("div");
      descriptionDiv.className = "newstile-description";
      descriptionDiv.textContent = description.textContent.trim();
      tileWrapper.appendChild(descriptionDiv);
    }

    // CTA Button (handle both link and asset)
    if (ctaLabel?.textContent.trim() !== "") {
      const ctaDiv = document.createElement("div");
      ctaDiv.className = "newstile-cta-label";

      let href = "";
      if (ctaType && ctaType.textContent.trim() === "link") {
        href = ctaLink ? ctaLink.textContent.trim() : "";
      } else if (ctaType && ctaType.textContent.trim() === "asset") {
        href = ctaAsset ? ctaAsset.textContent.trim() : "";
      }

      const ctaButton = createCTAButton({
        action: "navigation",
        type: ctaType?.textContent.trim() || "link",
        variation: "cta-text",
        label: ctaLabel.textContent.trim(),
        href,
        targetPath: targetPath?.textContent.trim() || "newTab",
        ariaLabel: newsTileAriaLabel?.textContent.trim() || "",
        componentName: "News Tile Component",
        // exitInterstitial: exitInterstitial?.textContent.trim() === 'true',
      });

      if (typeof ctaButton === "string") {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = ctaButton;
        ctaDiv.appendChild(tempDiv.firstElementChild);
      } else if (ctaButton instanceof Node) {
        ctaDiv.appendChild(ctaButton);
      }
      tileWrapper.appendChild(ctaDiv);
    }

    wrapper.appendChild(tileWrapper);
  });

  block.appendChild(wrapper);

  const tiles = wrapper.querySelectorAll(".newstile-item-container");
  const totalTiles = tiles.length;
  let currentPage = 0;

  const prev = document.createElement("button");
  prev.className = "carousel-prev";
  prev.setAttribute("tabindex", "0");
  prev.setAttribute("aria-label", "previous");

  const prevIcon = document.createElement("span");
  prevIcon.className = "icon-left-arrow";
  decorateIcon(prevIcon, "", "prev-icon");
  prev.appendChild(prevIcon);

  const next = document.createElement("button");
  next.className = "carousel-next";
  next.setAttribute("tabindex", "0");
  next.setAttribute("aria-label", "next");

  const nextIcon = document.createElement("span");
  nextIcon.className = "icon-right-arrow";
  decorateIcon(nextIcon, "", "next-icon");
  next.appendChild(nextIcon);

  const indicators = document.createElement("div");
  indicators.className = "carousel-indicators";

  block.appendChild(indicators);

  function updateCarousel() {
    const tileWidth = wrapper.querySelector(
      ".newstile-item-container",
    ).offsetWidth;
    const tileMargin =
      Number.parseInt(
        getComputedStyle(wrapper.querySelector(".newstile-item-container"))
          .marginRight,
        10,
      ) || 0;
    const offset = currentPage * (tileWidth + tileMargin);
    wrapper.scrollTo({
      left: offset,
      behavior: "smooth",
    });

    indicators.innerHTML = "";

    if (totalTiles > 3) {
      if (totalTiles >= 3 && totalTiles < 7) {
        indicators.appendChild(prev);
        for (let i = 0; i < totalTiles; i += 1) {
          const dot = document.createElement("div");
          dot.className = "carousel-dot";
          const isMobile = window.matchMedia("(max-width: 768px)").matches;
          if (isMobile) {
            prev.style.display = "none";
            next.style.display = "none";
          }
          if (i === currentPage) dot.classList.add("active");
          indicators.appendChild(dot);
        }
        indicators.appendChild(next);
      } else {
        const label = document.createElement("div");
        label.className = "carousel-numeric";

        const currentPageSpan = document.createElement("span");
        currentPageSpan.className = "current-page";
        currentPageSpan.textContent = `${currentPage + 1}`;

        const totalTilesText = document.createTextNode(` of ${totalTiles}`);

        label.appendChild(currentPageSpan);
        label.appendChild(totalTilesText);

        indicators.appendChild(prev);
        indicators.appendChild(label);
        indicators.appendChild(next);
      }
    }
  }

  tiles.forEach((tile, idx) => {
    tile.setAttribute("tabindex", "0");
    tile.addEventListener("focus", () => {
      if (currentPage !== idx) {
        currentPage = idx;
        updateCarousel();
      }
    });
  });

  const isMobileView = window.matchMedia("(max-width: 768px)").matches;
  if (isMobileView) {
    let startX = 0;
    let endX = 0;

    wrapper.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    wrapper.addEventListener("touchmove", (e) => {
      e.preventDefault();
      endX = e.touches[0].clientX;
    });

    wrapper.addEventListener("touchend", () => {
      const swipeDistance = startX - endX;

      if (swipeDistance > 50 && currentPage < totalTiles - 1) {
        currentPage += 1;
        updateCarousel();
      }

      if (swipeDistance < -50 && currentPage > 0) {
        currentPage -= 1;
        updateCarousel();
      }
    });
  }

  prev.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage -= 1;
      updateCarousel();
    }
  });

  next.addEventListener("click", () => {
    if (currentPage < totalTiles - 1) {
      currentPage += 1;
      updateCarousel();
    }
  });

  updateCarousel();
}
