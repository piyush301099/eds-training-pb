import createInput from "../../utils/csr-form/createInput.js";
import createMultiselect from "../../utils/csr-form/createMultiselect.js";
import createSubmitButton from "../../utils/csr-form/createSubmitButton.js";
import DEMO_GENERIC_NAMES from "../../utils/csr-form/demo-data/generic-names.js";
import DEMO_INDICATIONS from "../../utils/csr-form/demo-data/indications.js";
import DEMO_PHASES from "../../utils/csr-form/demo-data/phase.js";
import SEARCH_DATA from "../../utils/csr-form/demo-data/search-data.js";
import renderCsrResults from "../../utils/csr-form/renderCsrResults.js";

function getTextFromChild(parent, index, selector) {
  const child = parent.children[index];
  if (!child) return "";
  if (selector) {
    const el = child.querySelector(selector);
    return el ? el.textContent.trim() : child.textContent.trim();
  }
  return child.textContent.trim();
}

export default async function decorate(block) {
  // Prevent duplicate rendering
  if (block.querySelector(".form-container")) return;

  const phaseTitles = DEMO_PHASES.items.map((item) => item.fields.title);
  const phaseTitleToId = Object.fromEntries(
    DEMO_PHASES.items.map((item) => [item.fields.title, item.sys.id]),
  );
  const indicationTitles = DEMO_INDICATIONS.items.map(
    (item) => item.fields.title,
  );
  const indicationTitleToId = Object.fromEntries(
    DEMO_INDICATIONS.items.map((item) => [item.fields.title, item.sys.id]),
  );
  const genericTitles = DEMO_GENERIC_NAMES.items.map(
    (item) => item.fields.title,
  );
  const genericTitleToId = Object.fromEntries(
    DEMO_GENERIC_NAMES.items.map((item) => [item.fields.title, item.sys.id]),
  );
  const formTitle = getTextFromChild(
    block,
    0,
    'p[data-aue-prop="formTitleText"]',
  );
  const disclaimerText = getTextFromChild(
    block,
    1,
    'p[data-aue-prop="disclaimerText"]',
  );
  block.textContent = "";

  const container = document.createElement("div");
  container.className = "form-container";
  container.setAttribute("role", "form");
  container.setAttribute("aria-labelledby", "csr-form-title");

  const headingDiv = document.createElement("div");
  headingDiv.className = "form-heading";
  const title = document.createElement("h2");
  title.className = "csr-form-title";
  title.textContent = formTitle;
  title.id = "csr-form-title";
  const desc = document.createElement("p");
  desc.className = "csr-form-desc";
  desc.textContent = disclaimerText;
  headingDiv.append(title, desc);

  const form = document.createElement("form");
  form.id = "csrForm";

  function createRow(...elements) {
    const row = document.createElement("div");
    row.className = "form-row";
    elements.forEach((el) => row.appendChild(el));
    return row;
  }

  const inputFields = [
    ["title", "Title"],
    ["lillyTrialId", "Lilly Trial ID"],
    ["nctNumber", "NCT Number"],
    ["lillyTrialAlias", "Lilly Trial Alias"],
  ];
  const inputEls = inputFields.map(([name, label]) =>
    createInput("text", name, label),
  );
  const phasesMulti = createMultiselect("phases", "Phases", phaseTitles);
  const genericsMulti = createMultiselect(
    "genericNames",
    "Generic Names",
    genericTitles,
  );
  const indicationsMulti = createMultiselect(
    "indications",
    "Indications",
    indicationTitles,
  );

  const searchButtonDiv = document.createElement("div");
  searchButtonDiv.className = "search-button";
  searchButtonDiv.appendChild(createSubmitButton());

  form.append(
    createRow(inputEls[0], inputEls[1]),
    createRow(inputEls[2], inputEls[3]),
    createRow(phasesMulti, genericsMulti),
    createRow(indicationsMulti),
    searchButtonDiv,
  );

  // --- Analytics: fire form_view event on render ---
  if (window.adobeDataLayer && Array.isArray(window.adobeDataLayer)) {
    window.adobeDataLayer.push({
      event: "form_view",
      formName: "csr-form",
      component: "csr-form",
      timestamp: new Date().toISOString(),
    });
  }

  // --- Analytics: fire form_interaction on first interaction (any input) ---
  let formInteracted = false;
  form.addEventListener("input", () => {
    if (
      !formInteracted &&
      window.adobeDataLayer &&
      Array.isArray(window.adobeDataLayer)
    ) {
      window.adobeDataLayer.push({
        event: "form_interaction",
        formName: "csr-form",
        component: "csr-form",
        timestamp: new Date().toISOString(),
      });
      formInteracted = true;
    }
  });

  // --- Render CSR Search Results (hidden on load) ---
  const resultsDiv = document.createElement("div");
  resultsDiv.style.display = "none";

  // --- Analytics: fire form_error on submit error & show results on success ---
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const getIds = (titles, map) =>
      titles
        .map((t) => map[t])
        .filter(Boolean)
        .join(",");
    // eslint-disable-next-line no-unused-vars
    const payload = {
      content_type: "csr",
      order: "fields.lillyTrial",
      limit: 1000,
      "fields.phase.sys.id[in]": getIds(
        formData.getAll("phases"),
        phaseTitleToId,
      ),
      "fields.indication.sys.id[in]": getIds(
        formData.getAll("indications"),
        indicationTitleToId,
      ),
      "fields.title[match]": formData.get("title") || "",
      "fields.nctNumber": formData.get("nctNumber") || "",
      "fields.lillyTrial": formData.get("lillyTrialId") || "",
      "fields.study": formData.get("lillyTrialAlias") || "",
      "fields.genericName.sys.id[in]": getIds(
        formData.getAll("genericNames"),
        genericTitleToId,
      ),
    };
    try {
      // Replace with: const apiResults = await submitCsrSearch(payload);
      const apiResults = SEARCH_DATA; // Demo only
      const mappedResults = apiResults.map((item) => ({
        indication: item.indication?.fields?.title || "",
        title: item.title,
        pdf: item.pdf?.fields?.file?.url || "",
        genericName: item.genericName?.fields?.title || "",
        nctNumber: item.nctNumber,
        trialId: item.lillyTrial,
        phase: item.phase?.fields?.title || "",
        alias: item.study,
      }));
      resultsDiv.innerHTML = "";
      renderCsrResults(resultsDiv, mappedResults);
      resultsDiv.style.display = "";
    } catch (error) {
      if (window.adobeDataLayer && Array.isArray(window.adobeDataLayer)) {
        window.adobeDataLayer.push({
          event: "form_error",
          formName: "csr-form",
          component: "csr-form",
          errorType: "submit",
          timestamp: new Date().toISOString(),
        });
      }
      // Optionally show error to user here
      resultsDiv.style.display = "none";
    }
  });

  const csrFormDiv = document.createElement("div");
  csrFormDiv.className = "csr-form";
  csrFormDiv.appendChild(form);

  container.append(headingDiv, csrFormDiv);
  container.appendChild(resultsDiv);

  block.append(container);
}
