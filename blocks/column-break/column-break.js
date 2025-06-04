/**
 * Splits a section into columns at each .column-break-wrapper.
 * Usage: Place .column-break-wrapper where you want a new column to start.
 */
export default function decorate(block) {
  const parentDiv = block.parentElement?.parentElement;

  // Only show placeholder in the AEM Universal Editor (URL contains ui#), even inside iframes
  let isAuthor = false;
  try {
    isAuthor =
      window.top?.location?.href.includes("ui#") ||
      window.location.href.includes("ui#");
  } catch (e) {
    isAuthor = window.location.href.includes("ui#");
  }

  if (isAuthor) {
    block.innerHTML =
      '<div class="column-break-placeholder" style="min-height:2rem; border:.125rem dashed #888; padding:.75rem; text-align:center; color:#888; background:#f4f4f4; font-weight:bold;">Column Break (Author Only)</div>';
    return;
  }
  block.textContent = "";

  if (!parentDiv || !parentDiv.classList.contains("section")) return;

  parentDiv.classList.add("multi-column-split", "row", "lds-max-width");
  const extraStyles = parentDiv.getAttribute("data-extra-styles");
  if (extraStyles) {
    extraStyles
      .split(",")
      .map((s) => s.trim())
      .forEach((cls) => {
        if (cls) parentDiv.classList.add(cls);
      });
  }

  const children = Array.from(parentDiv.children);
  const breakIndices = children
    .map((el, index) =>
      el.classList.contains("column-break-wrapper") ? index : -1,
    )
    .filter((index) => index !== -1);

  if (breakIndices.length === 0) return; // No breaks, leave as-is

  const columnCount = breakIndices.length + 1;
  const colClass = `col-${12 / columnCount}`;

  // Split children into column groups
  const columns = [];
  let start = 0;
  breakIndices.forEach((breakIdx) => {
    columns.push(children.slice(start, breakIdx));
    start = breakIdx + 1;
  });
  columns.push(children.slice(start));

  // Create column divs and append all columns, even if empty
  const columnDivs = columns.map((columnElements, i) => {
    const colDiv = document.createElement("div");
    colDiv.className = `column ${colClass}`;
    colDiv.setAttribute("data-column-index", i);
    columnElements.forEach((el) => colDiv.appendChild(el));
    return colDiv;
  });

  parentDiv.innerHTML = "";
  columnDivs.forEach((col) => parentDiv.appendChild(col));
}
