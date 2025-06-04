export default function decorate(block) {
  const childElements = [...block.children];

  const getTextContent = (el) => el?.textContent.trim() || "";
  const getElement = (el, selector) => el?.querySelector(selector) || null;

  const [icon, iconAlt, descriptionColor, descriptionElement] = [
    getElement(childElements[0], "img"),
    getTextContent(childElements[1]),
    getTextContent(childElements[2]) || "primary",
    childElements[3] || null,
  ];

  block.textContent = "";
  const textCallOutContainer = document.createElement("div");
  textCallOutContainer.className = "text-call-out-container";

  const iconArea = document.createElement("div");
  if (icon) {
    iconArea.className = "text-call-out-icon-area";
    iconArea.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M31.5 24L40.5 33L31.5 42" stroke="#D31710" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.5 6V33H40.5" stroke="#D31710" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    if (iconAlt) {
      icon.alt = iconAlt;
    }
    icon.setAttribute("aria-hidden", "true");
    textCallOutContainer.appendChild(iconArea);
  }

  if (descriptionElement) {
    const descriptionDiv = document.createElement("div");
    descriptionDiv.className =
      "text-call-out-description lds-ringside-heading-4";
    descriptionDiv.textContent = descriptionElement.textContent.trim();
    descriptionDiv.setAttribute("aria-label", descriptionDiv.textContent);

    if (descriptionColor === "primary") {
      descriptionDiv.style.color = "var(--lds-g-color-neutral-base-100)";
    } else if (descriptionColor === "secondary") {
      descriptionDiv.style.color = "var(--lds-g-color-brand-1)";
      textCallOutContainer.classList.add("align-left");
      descriptionDiv.classList.add("align-left");
    }

    textCallOutContainer.appendChild(descriptionDiv);
  }

  block.appendChild(textCallOutContainer);
}
