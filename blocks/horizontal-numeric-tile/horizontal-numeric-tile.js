export default function decorate(block) {
  const child = [...block.children];

  const getElement = (el, selector) => el?.querySelector(selector) || null;
  const container = document.createElement("div");
  container.className = "horizontal-numeric-tile";

  const contentWrapper = document.createElement("div");
  contentWrapper.className = "horizontal-numeric-tile-content-wrapper";

  const titledescription = document.createElement("div");
  titledescription.className = "section-title-description-wrapper";
  contentWrapper.appendChild(titledescription);

  container.appendChild(contentWrapper);
  block.append(container);

  function createParagraphSection(source, className) {
    if (!source) return null;
    const ps = source.querySelectorAll("p");
    ps.forEach((p) => {
      p.remove();
    });
    if (ps.length) {
      const section = document.createElement("div");
      section.className = className;
      ps.forEach((p) => {
        const cloned = p.cloneNode(true);
        cloned.removeAttribute("style");
        section.appendChild(cloned);
      });
      return section;
    }
    return null;
  }

  const [variations, title, description, footer] = [
    getElement(child[0], "p"),
    getElement(child[1], "p"),
    getElement(child[2], "p"),
    getElement(child[3], "p"),
  ];
  if (variations) {
    variations.style.display = "none";
    if (variations.textContent.trim() === "variation-2") {
      contentWrapper.classList.add("red-black-variation");
      container.classList.add("red-black-variation");
    }
    child[0].remove();
  }
  if (title) {
    const titleSection = createParagraphSection(
      child[1],
      variations && variations.textContent.trim() === "variation-2"
        ? "horizontal-section-title red-black-variation"
        : "horizontal-section-title",
    );
    if (titleSection) {
      titledescription.appendChild(titleSection);
      child[1].remove();
    }
  }
  if (description) {
    const descSection = createParagraphSection(
      child[2],
      variations && variations.textContent.trim() === "variation-2"
        ? "horizontal-section-description red-black-variation"
        : "horizontal-section-description",
    );
    if (descSection) {
      titledescription.appendChild(descSection);
      child[2].remove();
    }
  }

  const horizontalTileContainer = block.querySelector(
    ".horizontal-numeric-tile",
  );

  if (!horizontalTileContainer) {
    return;
  }

  const containerParent = container.parentElement;
  const siblings = Array.from(containerParent.children);
  const containerIndex = siblings.indexOf(container);

  if (containerIndex === -1) {
    return;
  }

  const iconBlocks = [];

  for (let i = 0; i < containerIndex; i += 1) {
    const el = siblings[i];

    if (el.tagName === "DIV") {
      const innerDivs = Array.from(el.children);
      const hasTextDivs = innerDivs.filter((p) => p.tagName === "DIV");

      if (hasTextDivs.length === 2) {
        iconBlocks.push(el);
        el.classList.add("text-grid-item");
      }
    }
  }

  let cardsWrapper = block.querySelector(".horizontal-grid-container");
  if (!cardsWrapper) {
    cardsWrapper = document.createElement("div");
    cardsWrapper.className = "horizontal-grid-container";
  }

  if (variations && variations.textContent.trim() === "variation-2") {
    cardsWrapper.classList.add("variation-2");
    cardsWrapper.classList.remove("variation-1");
  } else {
    cardsWrapper.classList.add("variation-1");
    cardsWrapper.classList.remove("variation-2");
  }

  cardsWrapper.innerHTML = "";

  iconBlocks.forEach((parablocks) => {
    const childDivs = Array.from(parablocks.querySelectorAll(":scope > div"));

    const divider = document.createElement("div");
    divider.classList.add("divider");
    parablocks.insertBefore(divider, parablocks.firstChild);

    const contentParagraphs = document.createElement("div");
    contentParagraphs.classList.add("content-paragraphs");

    const variationsText = variations ? variations.textContent.trim() : "";

    if (variationsText === "variation-2") {
      contentParagraphs.classList.add("red-black-variation");
    } else {
      contentParagraphs.classList.remove("red-black-variation");
    }

    if (childDivs[0]) {
      const titleParagraphs = childDivs[0].querySelectorAll("p");
      const divTitle = document.createElement("div");

      titleParagraphs.forEach((p) => {
        if (variationsText === "variation-2") {
          p.classList.add("horizontal-grid-red-title");
        } else {
          p.classList.add("horizontal-grid-title");
        }
        divTitle.appendChild(p);
      });

      contentParagraphs.appendChild(divTitle);
      parablocks.removeChild(childDivs[0]);
    }

    if (childDivs[1]) {
      const descParagraphs = childDivs[1].querySelectorAll("p");
      const divDesc = document.createElement("div");

      descParagraphs.forEach((p) => {
        if (variationsText === "variation-2") {
          p.classList.add("horizontal-grid-red-description");
        } else {
          p.classList.add("horizontal-grid-description");
        }
        divDesc.appendChild(p);
      });

      contentParagraphs.appendChild(divDesc);
      parablocks.removeChild(childDivs[1]);
    }

    parablocks.appendChild(contentParagraphs);
    cardsWrapper.appendChild(parablocks);
    contentWrapper.appendChild(cardsWrapper);
  });

  if (variations && variations.textContent.trim() === "variation-2") {
    iconBlocks.forEach((chd) => chd.classList.remove("wide-item"));
    if (iconBlocks.length % 2 === 1) {
      const last = iconBlocks[iconBlocks.length - 1];
      last.classList.add("wide-item");
      const divider = last.querySelector(".divider");
      if (divider) divider.classList.add("wide-divider");
      if (last.parentNode) {
        last.parentNode.removeChild(last);
        cardsWrapper.appendChild(last);
      }
    }
  }

  let footerDiv = null;
  if (variations && variations.textContent.trim() === "variation-2" && footer) {
    footerDiv = createParagraphSection(child[3], "horizontal-grid-footer");
    if (child[3]) child[3].remove();
  } else if (footer) {
    const footerPs = child[3] ? child[3].querySelectorAll("p") : [];
    footerPs.forEach((p) => {
      p.remove();
    });
    if (child[3]) child[3].remove();
  }

  if (variations && variations.textContent.trim() === "variation-2") {
    const desc = contentWrapper.querySelector(
      ".horizontal-section-description",
    );
    const grid = contentWrapper.querySelector(".horizontal-grid-container");

    if (desc || grid || footerDiv) {
      const layout = document.createElement("div");
      layout.className = "red-bar-layout";

      const redBar = document.createElement("div");
      redBar.className = "horizontal-red-bar";

      const content = document.createElement("div");
      content.className = "red-bar-content";

      if (desc) content.appendChild(desc);
      if (grid) content.appendChild(grid);
      if (footerDiv) content.appendChild(footerDiv);

      layout.appendChild(redBar);
      layout.appendChild(content);

      contentWrapper.appendChild(layout);
    }
  }
  container.appendChild(contentWrapper);
}
