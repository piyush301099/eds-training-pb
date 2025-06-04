import { moveInstrumentation } from "../../scripts/scripts.js";
import { createlinks } from "../../utils/cta.js";

function generateHtml(fieldValue) {
  // Keep the field order exactly as in EDS
  const [
    headlinkLabel = "",
    headlinkctaType = "",
    headlinkUrl = "",
    headlinkctaAsset,
    headlinkArialabel = "",
    headlinkTargetPath = "",
    headlinkDescription = "",
    , // isExternalUrl (unused)
    // eslint-disable-next-line comma-style
    subtextHeadlinkLabel = "",
    subtextHeadlinkctaType = "",
    subtextHeadlinkUrl = "",
    subtextHeadlinkctaAsset = "",
    subtextArialabel = "",
    subtextHeadlinkTargetpath = "",
    // 10: Exit Interstitial for sub-text (unused)
  ] = fieldValue;

  // Create the main container for related links
  const node = document.createElement("div");
  node.classList.add("relatedlink");
  node.innerHTML = `
    <div class="relatedlinks-headlink">
      <div class="relatedlinks-headlink-text">
        <div class="label-container">
        </div>
        <div class="arrow-container" aria-hidden="true" tabindex="-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none" focusable="false" aria-hidden="true">
            <path d="M5 16.332H27" stroke="#191919" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
            <path d="M18 7.33203L27 16.332L18 25.332" stroke="#191919" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
    <div class="relatedlinks-headlink-description">
        <p id="relatedlinks-desc" tabindex="${headlinkDescription?.trim() ? "0" : "-1"}" ${!headlinkDescription || !headlinkDescription.trim() ? 'aria-hidden="true"' : ""}>
          ${headlinkDescription}
        </p>
    </div>
    <div class="relatedlinks-subtext">
    </div>
  `;

  const link = createlinks({
    action: "navigation",
    type: headlinkctaType || "",
    label: headlinkLabel || "",
    ariaLabel: headlinkArialabel || "",
    href: headlinkUrl,
    ctaAsset: headlinkctaAsset || "",
    targetPath: headlinkTargetPath || "",
    componentName: "Related links",
  });

  const linkLabelContainer = node.querySelector(".label-container");
  if (linkLabelContainer && link) {
    linkLabelContainer.appendChild(link);
  }

  const sublink = createlinks({
    action: "navigation",
    type: subtextHeadlinkctaType || "",
    label: subtextHeadlinkLabel || "",
    ariaLabel: subtextArialabel || "",
    href: subtextHeadlinkUrl,
    ctaAsset: subtextHeadlinkctaAsset || "",
    targetPath: subtextHeadlinkTargetpath || "",
    componentName: "Related links",
  });
  const sublinkLabelContainer = node.querySelector(".relatedlinks-subtext");
  if (sublinkLabelContainer && sublink) {
    sublinkLabelContainer.appendChild(sublink);
  }

  return node;
}

export default function decorate(block) {
  const blocks = [];
  let fieldValues = [];
  if (block.children.length === 0) return;
  Array.from(block.children).forEach((row, rowIndex) => {
    if (rowIndex > 1) return;
    [...row.children].forEach((ele, index) => {
      if (index === 3 || index === 11) {
        fieldValues.push(ele.children[0]);
      } else {
        fieldValues.push(ele.children[0]?.innerText);
      }
    });
    const node = generateHtml(fieldValues);
    moveInstrumentation(row, node);
    fieldValues = [];
    blocks.push(node);
  });

  block.textContent = "";
  blocks.forEach((node) => {
    block.append(node);
  });
}
