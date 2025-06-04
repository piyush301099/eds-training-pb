const extractImageData = (el) => {
  let src = "";
  let alt = "";
  if (el?.innerHTML) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = el.innerHTML;
    const img = tempDiv.querySelector("img");
    if (img) {
      src = img.getAttribute("src") || "";
      alt = img.getAttribute("alt") || "";
    }
  }
  if (el) el.innerHTML = "";
  return { src, alt };
};

export default function decorate(block) {
  const childElements = Array.from(block.children);
  const [
    imageElement,
    imagePlacementElement,
    titleElement,
    descriptionElement,
  ] = childElements;

  const { src: image, alt: imageAlt } = extractImageData(imageElement);

  block.innerHTML = "";

  const imageDiv = document.createElement("div");
  imageDiv.className = "image-container";
  imageDiv.innerHTML = `<img src="${image}" alt="${imageAlt}" />`;
  block.appendChild(imageDiv);

  const textContainer = document.createElement("div");
  textContainer.className = "text-container";

  const titleDiv = document.createElement("div");
  titleDiv.className = "title-container";
  titleDiv.textContent = titleElement.textContent.trim();

  const descriptionDiv = document.createElement("div");
  descriptionDiv.className = "description-container";
  descriptionDiv.innerHTML = descriptionElement.textContent.trim();

  textContainer.appendChild(titleDiv);
  textContainer.appendChild(descriptionDiv);

  const parentContainer = document.createElement("div");
  parentContainer.className = "parent-container";

  if (imagePlacementElement.textContent.trim() === "left") {
    parentContainer.classList.add("layout-row");
  } else if (imagePlacementElement.textContent.trim() === "right") {
    parentContainer.classList.add("layout-row-reverse");
  } else if (imagePlacementElement.textContent.trim() === "top") {
    parentContainer.classList.add("layout-column");
  } else {
    parentContainer.classList.add("layout-row");
  }

  parentContainer.appendChild(imageDiv);
  parentContainer.appendChild(textContainer);

  block.appendChild(parentContainer);
}
