import { moveInstrumentation } from "../../scripts/scripts.js";
import { decorateIcon } from "../../utils/common.js";

function generateTimelineItem([imgSrc, imgAlt, title, description], type) {
  const item = document.createElement("div");
  let className = "timeline-item";
  if (type === "first") className += " first-timeline-item";
  item.className = className;

  let svgWrapper = "";
  if (type === "first") {
    svgWrapper = `
      <div class="timeline-bg-svg-first" aria-hidden="true">
        <span class="icon-timeline-desktop timeline-bg-svg-desktop"></span>
        <span class="icon-timeline-mobile timeline-bg-svg-mobile"></span>
      </div>
    `;
  }

  item.innerHTML = `
    ${svgWrapper}
    <div class="timeline-item-content">
      <div class="title-container"><p class="title">${title || ""}</p></div>
      ${description ? `<div class="description-container"><p class="description">${description}</p></div>` : ""}
    </div>
    <div class="image-container">
      ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}" class="timeline-image" />` : ""}
    </div>
    <div class="space"></div>
  `;

  if (type === "first") {
    const desktopIcon = item.querySelector(".icon-timeline-desktop");
    const mobileIcon = item.querySelector(".icon-timeline-mobile");
    if (desktopIcon)
      decorateIcon(desktopIcon, "", "Timeline background desktop");
    if (mobileIcon) decorateIcon(mobileIcon, "", "Timeline background mobile");
  }

  return item;
}

function appendMiddleItems(list, items) {
  let i = 0;
  while (i < items.length) {
    list.appendChild(items[i]);
    i += 1;
  }
}

function createMiddleItems(items) {
  const wrapper = document.createElement("div");
  wrapper.className = "middle-items-wrapper";
  const timelineBar = document.createElement("div");
  timelineBar.className = "timeline-bar";
  wrapper.appendChild(timelineBar);
  const list = document.createElement("div");
  list.className = "middle-items-list";
  appendMiddleItems(list, items);
  wrapper.appendChild(list);

  return wrapper;
}

function createCarouselControls() {
  const controls = document.createElement("div");
  controls.className = "carousel-controls";

  const leftIcon = document.createElement("span");
  leftIcon.className = "icon-caretleft";
  decorateIcon(leftIcon, "", "left caret");

  const rightIcon = document.createElement("span");
  rightIcon.className = "icon-caretright";
  decorateIcon(rightIcon, "", "right caret");

  controls.innerHTML = `
  <button class="carousel-btn prev" aria-label="Previous"></button>
  <div class="carousel-pagination"></div>
  <button class="carousel-btn next" aria-label="Next"></button>
`;

  controls.querySelector(".carousel-btn.prev").appendChild(leftIcon);
  controls.querySelector(".carousel-btn.next").appendChild(rightIcon);

  return controls;
}

function setupCarousel(track, controls, liveRegion) {
  const firstItem = track.querySelector(".first-timeline-item");
  const middleList = track.querySelector(".middle-items-list");
  const middleItems = middleList
    ? Array.from(middleList.querySelectorAll(".timeline-item"))
    : [];
  const items = [firstItem, ...middleItems].filter(Boolean);
  const prevBtn = controls.querySelector(".carousel-btn.prev");
  const nextBtn = controls.querySelector(".carousel-btn.next");
  const pagination = controls.querySelector(".carousel-pagination");
  let currentIndex = 0;

  function updatePagination() {
    pagination.innerHTML = `<span class='active-slide'>${currentIndex + 1}</span> of ${items.length}`;
  }

  function getItemOffset(item) {
    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    return itemRect.left - trackRect.left + track.scrollLeft - 124;
  }

  function scrollToIndex(index) {
    currentIndex = index;
    const item = items[currentIndex];
    const offset = currentIndex !== 0 ? getItemOffset(item) : 0;
    track.style.transform = `translateX(-${offset}px)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === items.length - 1;
    updatePagination();
    // Accessibility: Announce current slide info
    if (liveRegion) {
      const title = item.querySelector(".title")?.textContent || "";
      const desc = item.querySelector(".description")?.textContent || "";
      const img = item.querySelector("img");
      const imgAlt = img ? img.alt : "";
      liveRegion.textContent = `Slide ${currentIndex + 1} of ${items.length}. ${title}. ${desc} ${imgAlt}`;
    }
  }

  function handlePrevClick() {
    scrollToIndex(currentIndex - 1);
  }

  function handleNextClick() {
    scrollToIndex(currentIndex + 1);
  }

  prevBtn.addEventListener("click", handlePrevClick);
  nextBtn.addEventListener("click", handleNextClick);
  window.addEventListener("resize", () => scrollToIndex(currentIndex));

  // --- Touch events for mobile swipe ---
  let startX = 0;
  let isTouching = false;

  track.addEventListener("touchstart", (e) => {
    if (window.innerWidth > 900) return; // Only on mobile
    isTouching = true;
    startX = e.touches[0].clientX;
  });

  track.addEventListener(
    "touchmove",
    (e) => {
      if (!isTouching) return;
      // Prevent scrolling the page while swiping carousel
      e.preventDefault();
    },
    { passive: false },
  );

  track.addEventListener("touchend", (e) => {
    if (!isTouching) return;
    isTouching = false;
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;
    const threshold = 50; // Minimum px to trigger swipe

    if (deltaX > threshold && currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    } else if (deltaX < -threshold && currentIndex < items.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  });

  scrollToIndex(0);
}

export default function decorate(block) {
  const rows = Array.from(block.children);

  if (!rows.length) return;

  const timelineNodes = rows.map((row, i) => {
    let imgSrc = "";
    let imgAlt = "";
    let title = "";
    let description = "";
    Array.from(row.children).forEach((cell) => {
      const img = cell.querySelector("img");
      if (img) {
        imgSrc = img.getAttribute("src") || "";
        imgAlt = img.getAttribute("alt") || "";
      } else if (!title) {
        title = cell.textContent ? cell.textContent.trim() : "";
      } else if (!description) {
        description = cell.textContent ? cell.textContent.trim() : "";
      }
    });
    const fields = [imgSrc, imgAlt, title, description];
    const type = i === 0 ? "first" : "middle";
    const node = generateTimelineItem(fields, type);

    Array.from(row.attributes).forEach((attr) => {
      if (attr.name.startsWith("data-") || attr.name.startsWith("aria-")) {
        node.setAttribute(attr.name, attr.value);
      }
    });
    moveInstrumentation(row, node);
    return node;
  });

  block.textContent = "";
  block.classList.add("timeline-carousel");

  const container = document.createElement("div");
  container.className = "timeline-item-container carousel-track";

  if (timelineNodes.length > 0) {
    container.appendChild(timelineNodes[0]);
  }

  if (timelineNodes.length > 1) {
    const middleItems = timelineNodes.slice(1);
    container.appendChild(createMiddleItems(middleItems));
  }

  const viewport = document.createElement("div");
  viewport.className = "carousel-viewport";
  viewport.appendChild(container);
  block.appendChild(viewport);

  const controls = createCarouselControls();
  block.appendChild(controls);

  // Accessibility: Add ARIA live region for screen reader announcements
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "carousel-live-region";
  block.appendChild(liveRegion);

  block.setAttribute("role", "region");
  block.setAttribute("aria-label", "Timeline carousel");

  setupCarousel(container, controls, liveRegion);
}
