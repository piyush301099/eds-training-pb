import { moveInstrumentation } from "../../scripts/scripts.js";

export default function decorate(block) {
  const children = [...block.children];
  const vertTitle = children[0];

  // Create and append header wrapper
  const headerWrapper = document.createElement("div");
  headerWrapper.className = "title-wrapper";
  if (vertTitle) {
    vertTitle.className = "title"; // Assign class to the first child
    vertTitle.setAttribute("aria-label", "Numeric List Heading");
    headerWrapper.appendChild(vertTitle.cloneNode(true));
  }
  block.textContent = ""; // Clear block content
  block.appendChild(headerWrapper);

  // Create and append list container
  const ul = document.createElement("ul");
  ul.className = "item-list";
  ul.setAttribute("aria-label", "Numeric List");

  children.slice(1).forEach((row) => {
    const li = document.createElement("li");
    li.className = "item-container";
    moveInstrumentation(row, li);

    // Create content-container
    const contentContainer = document.createElement("div");
    contentContainer.className = "content-container";
    contentContainer.setAttribute("aria-label", "List contents");

    // Create text-container
    const textContainer = document.createElement("div");
    textContainer.className = "text-container";

    // Append and assign classes to child elements
    [...row.children].forEach((div, index) => {
      if (index === 0) {
        div.className = "red-text";
        div.setAttribute("aria-label", "List number");
      } else if (index === 1) {
        div.className = "description lds-ringside-body-large";
        div.setAttribute("aria-label", "List description");
      } else {
        div.className = "others";
        div.setAttribute("aria-label", "List extra content");
      }
      textContainer.appendChild(div);
    });

    contentContainer.appendChild(textContainer);
    li.appendChild(contentContainer);
    ul.appendChild(li);
  });

  block.appendChild(ul);
}
