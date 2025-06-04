import { moveInstrumentation } from "../../scripts/scripts.js";
import { createlinks } from "../../utils/cta.js";

function generateHtml(fieldValues) {
  const [
    headlinkLabel = "",
    ctaType = "",
    headlinkUrl = "",
    ctaAsset = "",
    ariaLabel = "",
    headlinkTargetPath = "sameTab",
  ] = fieldValues;

  const node = document.createElement("div");
  node.classList.add("enrelatedlink");
  const link = createlinks({
    action: "navigation",
    type: ctaType || "",
    label: headlinkLabel || "",
    ariaLabel: ariaLabel || "",
    href: headlinkUrl,
    ctaAsset: ctaAsset || "",
    targetPath: headlinkTargetPath || "",
    componentName: "Enhanced Related links",
  });
  node.innerHTML = `
    <div class="enrelatedlink-headlink">
      <hr class="enrelatedlink-headlink-hr"/>
      <div class="enrelatedlink-headlink-text"> 
        <div class="link-lable"></div>
        <div class='arrow-icon'>
          <svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g id="ArrowRight">
              <path id="Vector" d="M3.75 12.3828H20.25" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_2" d="M13.5 5.63281L20.25 12.3828L13.5 19.1328" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
        </div>
      </div>
    </div>`;
  const linkLabelContainer = node.querySelector(".link-lable");
  if (linkLabelContainer && link) {
    linkLabelContainer.appendChild(link);
  }
  return node;
}

export default function decorate(block) {
  const blocks = [];
  let fieldValues = [];
  Array.from(block.children).forEach((row) => {
    [...row.children].forEach((ele, index) => {
      if (index === 3) {
        fieldValues.push(ele.children[0]);
      } else {
        fieldValues.push(ele.children[0]?.innerText);
      }
    });
    const node = generateHtml(fieldValues);
    moveInstrumentation(row, node);
    fieldValues = [];
    if (node) blocks.push(node);
  });

  block.textContent = "";
  blocks.forEach((node) => {
    block.append(node);
  });
}
