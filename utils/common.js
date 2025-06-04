/**
 * Retrieves the content of metadata tags.
 * @param {string} name The metadata name (or property)
 * @param {Document} doc Document object to query for metadata. Defaults to the window's document
 * @returns {string} The metadata value(s)
 */
export function getMetadata(name, doc = document) {
  const attr = name?.includes(":") ? "property" : "name";
  const meta = [...doc.head.querySelectorAll(`meta[${attr}="${name}"]`)]
    .map((m) => m.content)
    .join(", ");
  return meta || "";
}

/**
 * Add <img> for icon, prefixed with codeBasePath and optional prefix.
 * @param {Element} [span] span element with icon classes
 * @param {string} [prefix] prefix to be added to icon src
 * @param {string} [alt] alt text to be added to icon
 */
export function decorateIcon(span, prefix = "", alt = "") {
  const iconName = Array.from(span.classList)
    .find((c) => c.startsWith("icon-"))
    .substring(5);
  const img = document.createElement("img");
  img.dataset.iconName = iconName;
  img.src = `${window.hlx.codeBasePath}${prefix}/icons/${iconName}.svg`;
  img.alt = alt;
  img.loading = "lazy";
  img.width = 16;
  img.height = 16;
  span.append(img);
}
