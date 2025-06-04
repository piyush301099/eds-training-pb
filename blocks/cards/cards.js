import { createOptimizedPicture } from "../../scripts/aem.js";
import { moveInstrumentation } from "../../scripts/scripts.js";
import { createCTAButton } from "../../utils/cta.js";

function addDotPagination(block, cardsCount) {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";
  paginationContainer.setAttribute("aria-label", "dotted pagination");

  const isMobile = window.innerWidth <= 768;
  const totalPages = isMobile ? cardsCount - 1 : cardsCount - 3;
  let currentIndex = 0;

  const prevButton = document.createElement("span");
  prevButton.className = `arrow prev ${currentIndex === 0 && "disabled"}`;
  prevButton.setAttribute("tabindex", "0");
  prevButton.setAttribute("aria-label", "previous");
  prevButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true">
      <path d="M6.89093 10.7043C6.93797 10.7513 6.97529 10.8072 7.00075 10.8686C7.0262 10.9301 7.03931 10.996 7.03931 11.0625C7.03931 11.129 7.0262 11.1949 7.00075 11.2564C6.97529 11.3178 6.93797 11.3737 6.89093 11.4207C6.84389 11.4678 6.78804 11.5051 6.72658 11.5305C6.66512 11.556 6.59924 11.5691 6.53271 11.5691C6.46619 11.5691 6.40031 11.556 6.33885 11.5305C6.27739 11.5051 6.22154 11.4678 6.1745 11.4207L1.11138 6.35761C1.06431 6.31058 1.02697 6.25474 1.00149 6.19328C0.976006 6.13181 0.962891 6.06593 0.962891 5.99939C0.962891 5.93285 0.976006 5.86697 1.00149 5.8055C1.02697 5.74404 1.06431 5.6882 1.11138 5.64118L6.1745 0.578065C6.2695 0.48306 6.39836 0.429687 6.53271 0.429688C6.66707 0.429688 6.79593 0.48306 6.89093 0.578065C6.98593 0.67307 7.03931 0.801923 7.03931 0.93628C7.03931 1.07064 6.98593 1.19949 6.89093 1.2945L2.1854 5.99939L6.89093 10.7043Z" fill="#000000"/>
    </svg>
  `;

  const nextButton = document.createElement("span");
  nextButton.className = `arrow next ${currentIndex === totalPages && "disabled"}`;
  nextButton.setAttribute("tabindex", "0");
  nextButton.setAttribute("aria-label", "next");
  nextButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true">
      <path d="M6.89413 6.35761L1.82568 11.4207C1.77859 11.4678 1.72268 11.5051 1.66116 11.5305C1.59963 11.556 1.53368 11.5691 1.46709 11.5691C1.40049 11.5691 1.33455 11.556 1.27302 11.5305C1.21149 11.5051 1.15559 11.4678 1.10849 11.4207C1.0614 11.3737 1.02405 11.3178 0.998563 11.2564C0.973078 11.1949 0.959961 11.129 0.959961 11.0625C0.959961 10.996 0.973078 10.9301 0.998563 10.8686C1.02405 10.8072 1.0614 10.7513 1.10849 10.7043L5.81898 5.99939L1.10849 1.2945C1.01339 1.19949 0.959961 1.07064 0.959961 0.93628C0.959961 0.801923 1.01339 0.67307 1.10849 0.578065C1.2036 0.48306 1.33259 0.429688 1.46709 0.429688C1.60159 0.429687 1.73058 0.48306 1.82568 0.578065L6.89413 5.64118C6.94125 5.6882 6.97864 5.74404 7.00414 5.8055C7.02965 5.86697 7.04278 5.93285 7.04278 5.99939C7.04278 6.06593 7.02965 6.13181 7.00414 6.19328C6.97864 6.25474 6.94125 6.31058 6.89413 6.35761Z" fill="#3A3A3A"/>
    </svg>
  `;

  const dotWrapper = document.createElement("div");
  dotWrapper.className = "dot-pagination";
  const dots = [];
  const indicator = document.createElement("div");
  indicator.className = "div-indicator";

  function updateDots() {
    const itemList = block.querySelector(".cards.scrollable .itemList");
    if (itemList) {
      const cardWidth =
        itemList.querySelector(".cardContainer")?.offsetWidth || 0;
      itemList.scrollLeft = currentIndex * (cardWidth + 20);
    }
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });

    prevButton.classList.toggle("disabled", currentIndex === 0);
    nextButton.classList.toggle("disabled", currentIndex === totalPages);
  }

  Array.from({ length: totalPages + 1 }).forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (i === 0) dot.classList.add("active");
    dotWrapper.appendChild(dot);
    dots.push(dot);
  });

  dotWrapper.appendChild(indicator);

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateDots();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < totalPages) {
      currentIndex += 1;
      updateDots();
    }
  });

  prevButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (currentIndex > 0) {
        currentIndex -= 1;
        updateDots();
      }
    }
  });

  nextButton.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (currentIndex < totalPages) {
        currentIndex += 1;
        updateDots();
      }
    }
  });

  const itemList = block.querySelector(".cards.scrollable .itemList");
  if (itemList) {
    itemList.addEventListener("focusin", (e) => {
      const focusedCard = e.target.closest(".cardContainer");
      if (focusedCard) {
        const cardIndex = Array.from(
          itemList.querySelectorAll(".cardContainer"),
        ).indexOf(focusedCard);
        currentIndex = isMobile
          ? cardIndex
          : Math.max(0, Math.min(totalPages, cardIndex - 2));
        updateDots();
      }
    });
  }

  prevButton.addEventListener("focus", () => {
    prevButton.classList.remove("disabled");
    prevButton.setAttribute("aria-label", "previous active");
  });

  nextButton.addEventListener("focus", () => {
    nextButton.classList.remove("disabled");
    nextButton.setAttribute("aria-label", "next active");
  });

  prevButton.addEventListener("blur", () => {
    if (currentIndex === 0) {
      prevButton.classList.add("disabled");
    }
  });

  paginationContainer.addEventListener("keydown", (e) => {
    const lastDot = dots[dots.length - 1];
    const firstDot = dots[0];

    if (e.key === "Tab") {
      if (document.activeElement === lastDot && !e.shiftKey) {
        e.preventDefault();
        nextButton.focus();
      } else if (document.activeElement === nextButton && e.shiftKey) {
        e.preventDefault();
        lastDot.focus();
      } else if (document.activeElement === prevButton && e.shiftKey) {
        e.preventDefault();
        firstDot.focus();
      }
    }
  });

  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(dotWrapper);
  paginationContainer.appendChild(nextButton);

  block.appendChild(paginationContainer);
}

function addNumericalPagination(block, cardsCount) {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "numerical-pagination-container";
  paginationContainer.setAttribute("aria-label", "numerical pagination");

  const isMobile = window.innerWidth <= 768;
  const totalPages = isMobile ? cardsCount : cardsCount - 3;
  let currentIndex = 0;

  const prevButton = document.createElement("span");
  prevButton.className = "arrow prev disabled";
  prevButton.setAttribute("aria-label", "previous");
  prevButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true">
      <path d="M6.89093 10.7043C6.93797 10.7513 6.97529 10.8072 7.00075 10.8686C7.0262 10.9301 7.03931 10.996 7.03931 11.0625C7.03931 11.129 7.0262 11.1949 7.00075 11.2564C6.97529 11.3178 6.93797 11.3737 6.89093 11.4207C6.84389 11.4678 6.78804 11.5051 6.72658 11.5305C6.66512 11.556 6.59924 11.5691 6.53271 11.5691C6.46619 11.5691 6.40031 11.556 6.33885 11.5305C6.27739 11.5051 6.22154 11.4678 6.1745 11.4207L1.11138 6.35761C1.06431 6.31058 1.02697 6.25474 1.00149 6.19328C0.976006 6.13181 0.962891 6.06593 0.962891 5.99939C0.962891 5.93285 0.976006 5.86697 1.00149 5.8055C1.02697 5.74404 1.06431 5.6882 1.11138 5.64118L6.1745 0.578065C6.2695 0.48306 6.39836 0.429687 6.53271 0.429688C6.66707 0.429688 6.79593 0.48306 6.89093 0.578065C6.98593 0.67307 7.03931 0.801923 7.03931 0.93628C7.03931 1.07064 6.98593 1.19949 6.89093 1.2945L2.1854 5.99939L6.89093 10.7043Z" fill="#000000"/>
    </svg>
  `;

  const nextButton = document.createElement("span");
  nextButton.className = "arrow next";
  nextButton.setAttribute("aria-label", "next");
  nextButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none" aria-hidden="true">
      <path d="M6.89413 6.35761L1.82568 11.4207C1.77859 11.4678 1.72268 11.5051 1.66116 11.5305C1.59963 11.556 1.53368 11.5691 1.46709 11.5691C1.40049 11.5691 1.33455 11.556 1.27302 11.5305C1.21149 11.5051 1.15559 11.4678 1.10849 11.4207C1.0614 11.3737 1.02405 11.3178 0.998563 11.2564C0.973078 11.1949 0.959961 11.129 0.959961 11.0625C0.959961 10.996 0.973078 10.9301 0.998563 10.8686C1.02405 10.8072 1.0614 10.7513 1.10849 10.7043L5.81898 5.99939L1.10849 1.2945C1.01339 1.19949 0.959961 1.07064 0.959961 0.93628C0.959961 0.801923 1.01339 0.67307 1.10849 0.578065C1.2036 0.48306 1.33259 0.429688 1.46709 0.429688C1.60159 0.429687 1.73058 0.48306 1.82568 0.578065L6.89413 5.64118C6.94125 5.6882 6.97864 5.74404 7.00414 5.8055C7.02965 5.86697 7.04278 5.93285 7.04278 5.99939C7.04278 6.06593 7.02965 6.13181 7.00414 6.19328C6.97864 6.25474 6.94125 6.31058 6.89413 6.35761Z" fill="#3A3A3A"/>
    </svg>
  `;

  const pageInfoWrapper = document.createElement("div");
  pageInfoWrapper.className = "page-info-wrapper";

  const activePageContainer = document.createElement("div");
  activePageContainer.className = "active-page-container";

  const totalPageInfoContainer = document.createElement("div");
  totalPageInfoContainer.className = "total-page-info-container";
  totalPageInfoContainer.textContent = ` of ${totalPages}`;

  pageInfoWrapper.appendChild(activePageContainer);
  activePageContainer.setAttribute("aria-label", `page ${totalPages}`);
  pageInfoWrapper.appendChild(totalPageInfoContainer);

  function updatePagination() {
    const itemList = block.querySelector(".cards.scrollable .itemList");
    if (itemList) {
      const cardWidth =
        itemList.querySelector(".cardContainer")?.offsetWidth || 0;
      itemList.scrollLeft = currentIndex * (cardWidth + 20);
    }

    activePageContainer.textContent = currentIndex + 1;

    prevButton.classList.toggle("disabled", currentIndex === 0);
    nextButton.classList.toggle("disabled", currentIndex === totalPages);
  }

  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex = Math.max(0, currentIndex - 1);
      updatePagination();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex < totalPages - 1) {
      currentIndex = Math.min(totalPages - 1, currentIndex + 1);
      updatePagination();
    }
  });

  paginationContainer.appendChild(prevButton);
  paginationContainer.appendChild(pageInfoWrapper);
  paginationContainer.appendChild(nextButton);

  block.appendChild(paginationContainer);

  updatePagination();
}

export default function decorate(block) {
  const children = [...block.children];
  const cardsCount = children.length - 1;
  let currentIndex = 0;
  const cardsTitle = children[0];
  const headerWrapper = document.createElement("div");
  headerWrapper.className = "cardsTitle lds-garamond-heading-2";
  if (cardsTitle) {
    headerWrapper.appendChild(cardsTitle.cloneNode(true));
    cardsTitle.remove();
  }

  block.insertBefore(headerWrapper, block.firstChild);
  const isMobile = window.innerWidth <= 768;

  block.classList.toggle("twoCards", cardsCount === 2);
  block.classList.toggle("threeCards", cardsCount === 3);
  block.classList.toggle(
    "scrollable",
    cardsCount > 3 || (cardsCount === 3 && isMobile),
  );

  const ul = document.createElement("ul");
  ul.className = "itemList cards";

  // Helper function like in executive-tile
  const getTrimmedText = (el) => el?.textContent?.trim() || "";

  children.slice(1).forEach((row) => {
    const li = document.createElement("li");
    li.className = "cardContainer";
    moveInstrumentation(row, li);

    // Extract card elements using destructuring
    const [
      imageDiv,
      titleDiv,
      descriptionDiv,
      ctaLabel,
      ctaType,
      ctaLinkDiv,
      ctaAsset,
      cardTileAriaLabel,
      ctaTargetDiv,
    ] = row.children;
    block.textContent = "";
    block.insertBefore(headerWrapper, block.firstChild);

    // Process image element
    if (imageDiv) {
      imageDiv.className = "card-image";
      li.append(imageDiv);
    }

    // Process title element
    if (titleDiv) {
      titleDiv.className = "title lds-ringside-heading-4";
      li.append(titleDiv);
    }

    // Process description element
    if (descriptionDiv) {
      descriptionDiv.className = "description lds-ringside-body-medium";
      if (!getTrimmedText(descriptionDiv)) {
        descriptionDiv.style.display = "none";
      }
      li.append(descriptionDiv);
    }

    // Process CTA button element (using ctaLabel as the visible CTA)
    if (ctaLabel) {
      // Create CTA button using the utility
      const ctaLink = ctaLinkDiv ? getTrimmedText(ctaLinkDiv) : null;
      const ctaTarget = ctaTargetDiv ? getTrimmedText(ctaTargetDiv) : null;

      const buttonLink = createCTAButton({
        action: "navigation",
        type: ctaType ? ctaType.textContent.trim() : "",
        variation: "cta-text",
        label: getTrimmedText(ctaLabel),
        href: ctaLinkDiv?.querySelector("a")?.href || ctaLink,
        ariaLabel: cardTileAriaLabel?.textContent.trim(),
        ctaAsset,
        targetPath: ctaTarget,
        componentName: "Cards Component",
      });

      if (buttonLink) {
        const cardIndex =
          Array.from(ul.querySelectorAll(".cardContainer")).length + 1;
        const ariaLabelSuffix =
          ctaTarget === "newTab" ? "opening in new tab" : "";
        buttonLink.setAttribute(
          "aria-label",
          `${buttonLink.textContent} (${cardIndex} / ${cardsCount})${ariaLabelSuffix}`,
        );
        // Wrap CTA in a div for styling
        const ctaWrapper = document.createElement("div");
        ctaWrapper.className = "cta-button lds-ringside-cta-text-link";
        ctaWrapper.appendChild(buttonLink);
        li.append(ctaWrapper);
      }
    }

    ul.append(li);
  });

  ul.querySelectorAll("picture > img").forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: "750" },
    ]);
    moveInstrumentation(img, optimizedPic.querySelector("img"));
    img.closest("picture").replaceWith(optimizedPic);
  });

  block.append(ul);

  function updateDotPagination(index) {
    const dots = block.querySelectorAll(".dot-pagination .dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function updateNumericalPagination(index) {
    const activePageContainer = block.querySelector(".active-page-container");
    if (activePageContainer) {
      activePageContainer.textContent = index + 1;
    }
  }

  if (cardsCount >= 3) {
    let startX = 0;
    let scrollLeft = 0;

    ul.setAttribute("tabindex", "0");
    ul.style.outline = "none";

    ul.addEventListener("click", () => {
      ul.focus();
    });

    ul.addEventListener("touchstart", (e) => {
      startX = e.touches[0].pageX;
      scrollLeft = ul.scrollLeft;
    });

    ul.addEventListener("touchmove", (e) => {
      e.preventDefault();
      const x = e.touches[0].pageX - startX;
      ul.scrollLeft = scrollLeft - x;

      const cardWidth = ul.querySelector(".cardContainer")?.offsetWidth || 0;
      const newIndex = Math.round(ul.scrollLeft / (cardWidth + 20));

      const isMobileView = window.innerWidth <= 768;
      const maxIndex = isMobile ? cardsCount - 1 : cardsCount - 3;
      currentIndex = Math.max(0, Math.min(maxIndex, newIndex));

      if (x > 0) {
        currentIndex = Math.max(0, Math.min(maxIndex, currentIndex - 1));
      } else if (x < 0) {
        currentIndex = Math.max(0, Math.min(maxIndex, currentIndex + 1));
      }
      if (
        (cardsCount > 3 && cardsCount <= 7) ||
        (cardsCount === 3 && isMobileView)
      ) {
        updateDotPagination(currentIndex);
      }
      if (cardsCount > 7) {
        updateDotPagination(currentIndex);
      }
      if (cardsCount > 7 && isMobileView) {
        updateNumericalPagination(currentIndex);
      }

      const prevButton = block.querySelector(".arrow.prev");
      const nextButton = block.querySelector(".arrow.next");
      if (prevButton && currentIndex === 0) {
        prevButton.classList.add("disabled");
      } else {
        prevButton.classList.remove("disabled");
      }
      if (nextButton && currentIndex === cardsCount - 3) {
        nextButton.classList.add("disabled");
      } else {
        nextButton.classList.remove("disabled");
      }
    });

    document.addEventListener("keydown", (e) => {
      const cardWidth = ul.querySelector(".cardContainer")?.offsetWidth || 0;

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const isRightArrow = e.key === "ArrowRight";
        if (isRightArrow && currentIndex < cardsCount - 3) {
          currentIndex += 1;
        } else if (!isRightArrow && currentIndex > 0) {
          currentIndex -= 1;
        } else {
          return;
        }

        ul.scrollLeft = currentIndex * cardWidth;

        if (cardsCount > 3) {
          updateDotPagination(currentIndex);

          if (cardsCount > 7) {
            updateNumericalPagination(currentIndex);
          }
        }

        const prevButton = block.querySelector(".arrow.prev");
        const nextButton = block.querySelector(".arrow.next");

        if (prevButton)
          prevButton.classList.toggle("disabled", currentIndex === 0);
        if (nextButton)
          nextButton.classList.toggle(
            "disabled",
            currentIndex === cardsCount - 3,
          );
      }
    });
  }

  function applyPagination() {
    const existingPagination = block.querySelector(
      ".pagination-container, .numerical-pagination-container",
    );
    if (existingPagination) {
      existingPagination.remove();
    }

    if (!isMobile && cardsCount > 3) {
      addDotPagination(block, cardsCount);
    } else if (isMobile) {
      if (cardsCount >= 3 && cardsCount <= 7) {
        addDotPagination(block, cardsCount);
      } else if (cardsCount > 7) {
        addNumericalPagination(block, cardsCount);
      }
    }
  }
  applyPagination();

  window.addEventListener("resize", () => {
    applyPagination();
  });
}
