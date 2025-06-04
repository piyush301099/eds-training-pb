/* eslint-disable */
// eslint-disable-next-line import/no-cycle
export default async function decorate(block) {
  // Fetch data from clinical-pipeline.json
  const response = await fetch("./blocks/lcdp/clinical-pipeline.json");
  const pipelineData = await response.json();

  // Extract relevant data
  const molecules = pipelineData.molecules; // Use the "molecules" array from the JSON
  const therapeuticAreas = pipelineData.therapeutic_areas; // Use the "therapeutic_areas" array from the JSON
  const phaseTitles = pipelineData.phase_titles; // Use the "phase_titles" array from the JSON

  // Map therapeutic area IDs to titles
  const therapeuticAreaMap = therapeuticAreas.reduce((acc, area) => {
    acc[area.id] = area.title;
    return acc;
  }, {});

  // Get unique typeFilters, modalityTitles, and therapeuticAreas for pills
  const typeFilters = [
    ...new Set(molecules.map((molecule) => molecule.typeFilter)),
  ];
  const modalityFilters = [
    ...new Set(molecules.map((molecule) => molecule.modalityTitle)),
  ];
  const therapeuticAreaFilters = [
    ...therapeuticAreas
      .map((area) => area.title)
      .sort((a, b) => a.localeCompare(b)), // Sort alphabetically
  ];

  // Create pills for filtering
  const createFilterPills = (filters, className) => {
    const pillContainer = document.createElement("div");
    pillContainer.className = className;

    filters.forEach((filter) => {
      const pill = document.createElement("button");
      const pillClass = filter.toLowerCase().replace(/\s+/g, "-");
      pill.className = `lds-pill lds-pill--filled lds-pill--sm lds-pill--${pillClass} filter-pill`;
      pill.textContent = filter;
      pill.dataset.filter = filter;
      pillContainer.appendChild(pill);
    });

    return pillContainer;
  };

  // Sort molecules alphabetically by title
  const sortedMolecules = molecules.sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  // Create a container for the pipeline content
  const pipelineContainer = document.createElement("div");
  pipelineContainer.className = "pipeline-container";

  // Group molecules by phase
  const groupedByPhase = sortedMolecules.reduce((acc, molecule) => {
    const phase = phaseTitles[molecule.phase] || "Unknown Phase";
    if (!acc[phase]) acc[phase] = [];
    acc[phase].push(molecule);
    return acc;
  }, {});

  // Define the custom order of phases
  const customPhaseOrder = [
    "Regulatory Approval Achieved",
    "Regulatory Review",
    "Phase 3",
    "Phase 2",
    "Phase 1",
    "Unknown Phase",
  ];

  // Sort the phases based on the custom order
  const sortedPhases = Object.keys(groupedByPhase).sort(
    (a, b) => customPhaseOrder.indexOf(a) - customPhaseOrder.indexOf(b),
  );

  // Render each phase section
  const renderPipeline = (filters) => {
    pipelineContainer.innerHTML = ""; // Clear previous content

    sortedPhases.forEach((phase) => {
      const phaseSection = document.createElement("div");
      phaseSection.className = "pipeline-phase-section";

      // Add phase title
      const phaseTitle = document.createElement("h3");
      phaseTitle.textContent = phase;
      phaseSection.appendChild(phaseTitle);

      // Add molecule cards for this phase
      const moleculesInPhase = groupedByPhase[phase].filter((molecule) => {
        if (filters === "All") return true;
        return filters.some(
          (filter) =>
            therapeuticAreaMap[molecule.therapeutic_area_id] === filter ||
            molecule.typeFilter === filter ||
            molecule.modalityTitle === filter,
        );
      });

      // LDS grid row
      const cardRow = document.createElement("div");
      cardRow.className = "lds-row";

      // Group moleculesInPhase into chunks of 3 for each row
      for (let i = 0; i < moleculesInPhase.length; i += 3) {
        const row = document.createElement("div");
        row.className = "lds-row";

        const chunk = moleculesInPhase.slice(i, i + 3);
        const cardCols = [];
        chunk.forEach((molecule) => {
          const cardCol = document.createElement("div");
          cardCol.className = "lds-col lds-col--12 lds-col--4";

          // Get the therapeutic area title and color
          const therapeuticArea =
            therapeuticAreaMap[molecule.therapeutic_area_id];
          const therapeuticAreaClass = therapeuticArea
            ?.toLowerCase()
            .replace(/\s+/g, "-");

          cardCol.innerHTML = `
            <div class="lds-card" id="card-${molecule.id}">
              <div class="lds-card__body">
                <span class="lds-pill lds-pill--filled lds-pill--sm lds-pill--${therapeuticAreaClass}">
                  ${therapeuticArea}
                </span>
                <h4 class="lds-card__title">
                  ${molecule.title}
                  ${
                    molecule.regulatory_approval_achieved
                      ? `
                    <span class="regulatory_approval_achieved" title="Regulatory Approval Achieved">
                      <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                        <path d="M4.3125 13.7422L9.5625 18.9922L21.5625 6.99219" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                  `
                      : ""
                  }
                  ${
                    molecule.stateTitle &&
                    molecule.stateTitle.toUpperCase() === "NEW"
                      ? `<span class="new_to_pipeline" title="New to pipeline">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                    <path d="M4.3125 12.2422H20.8125" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.5625 3.99219V20.4922" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>`
                      : ""
                  }
                  ${
                    molecule.stateTitle &&
                    molecule.stateTitle.toLowerCase() === "milestone" &&
                    !molecule.regulatory_approval_achieved
                      ? `<span class="milestone_achieved" title="Milestone Achieved">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
                    <path d="M5.66812 19.1366C4.80562 18.2741 5.3775 16.4619 4.93875 15.4006C4.48313 14.3047 2.8125 13.4141 2.8125 12.2422C2.8125 11.0703 4.48313 10.1797 4.93875 9.08375C5.3775 8.02344 4.80562 6.21031 5.66812 5.34781C6.53062 4.48531 8.34375 5.05719 9.40406 4.61844C10.5047 4.16281 11.3906 2.49219 12.5625 2.49219C13.7344 2.49219 14.625 4.16281 15.7209 4.61844C16.7822 5.05719 18.5944 4.48531 19.4569 5.34781C20.3194 6.21031 19.7475 8.0225 20.1863 9.08375C20.6419 10.1844 22.3125 11.0703 22.3125 12.2422C22.3125 13.4141 20.6419 14.3047 20.1863 15.4006C19.7475 16.4619 20.3194 18.2741 19.4569 19.1366C18.5944 19.9991 16.7822 19.4272 15.7209 19.8659C14.625 20.3216 13.7344 21.9922 12.5625 21.9922C11.3906 21.9922 10.5 20.3216 9.40406 19.8659C8.34375 19.4272 6.53062 19.9991 5.66812 19.1366Z" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.8125 12.9922L11.0625 15.2422L16.3125 9.99219" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>`
                      : ""
                  }
          </h4>
          <div class="lds-card__meta">
            <div class="lds-card__meta-item">${molecule.indication || "No Indication Available"}</div><br>
            <div class="lds-card__meta-item">${molecule.modalityTitle}</div>
            <div class="lds-card__meta-item">${molecule.typeTitle}</div>
            <div class="lds-card__meta-item">
              <button type="button" class="lds-link lds-link--primary lds-card__footer-link" data-molecule-id="${molecule.id}">
                View more information
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
          cardCols.push(cardCol);
          row.appendChild(cardCol);
        });

        // Add a single details row below the cards in this row
        const detailsRow = document.createElement("div");
        detailsRow.className = "lds-col lds-col--12";
        // Add a data attribute to store the therapeutic area class, will be set dynamically
        detailsRow.innerHTML = `<div class="lds-card__details"></div>`;
        row.appendChild(detailsRow);

        phaseSection.appendChild(row);
      }

      if (moleculesInPhase.length > 0) {
        pipelineContainer.appendChild(phaseSection);
      }
    });
  };

  // --- Inject "Molecule group filters" as an h3 above the Therapeutic Area tabs ---
  const filterHeader = document.createElement("h2");
  filterHeader.textContent = "Molecule group filters";
  filterHeader.className = "molecule-group-filters-title";
  block.appendChild(filterHeader);

  // Add filter pills for therapeutic areas in a new line
  const therapeuticAreaPills = createFilterPills(
    therapeuticAreaFilters,
    "therapeutic-area-pills",
  );
  const therapeuticAreaTitle = document.createElement("h6");
  therapeuticAreaTitle.textContent = "Therapeutic Areas";
  therapeuticAreaTitle.className = "therapeutic-area-title";
  block.appendChild(therapeuticAreaTitle);
  block.appendChild(therapeuticAreaPills);

  // Add filter pills for typeFilters and modalityTitles
  const typeAndModalityPills = createFilterPills(
    [...typeFilters, ...modalityFilters],
    "filter-pills",
  );
  const typeAndModalityPillsTitle = document.createElement("h6");
  typeAndModalityPillsTitle.textContent = "Type";
  typeAndModalityPillsTitle.className = "type-and-modality-title";
  block.appendChild(typeAndModalityPillsTitle);
  block.appendChild(typeAndModalityPills);

  // Add legend above pipelineContainer
  const legend = document.createElement("div");
  legend.className = "pipeline-legend";
  legend.innerHTML = `
    <span class="legend-item regulatory_approval_achieved">
      <span class="legend-icon" aria-label="Regulatory Approval Achieved">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
          <path d="M4.3125 13.7422L9.5625 18.9922L21.5625 6.99219" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      Regulatory approval achieved
    </span>
    <span class="legend-item milestone_achieved">
      <span class="legend-icon" aria-label="Milestone Achieved">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
          <path d="M5.66812 19.1366C4.80562 18.2741 5.3775 16.4619 4.93875 15.4006C4.48313 14.3047 2.8125 13.4141 2.8125 12.2422C2.8125 11.0703 4.48313 10.1797 4.93875 9.08375C5.3775 8.02344 4.80562 6.21031 5.66812 5.34781C6.53062 4.48531 8.34375 5.05719 9.40406 4.61844C10.5047 4.16281 11.3906 2.49219 12.5625 2.49219C13.7344 2.49219 14.625 4.16281 15.7209 4.61844C16.7822 5.05719 18.5944 4.48531 19.4569 5.34781C20.3194 6.21031 19.7475 8.0225 20.1863 9.08375C20.6419 10.1844 22.3125 11.0703 22.3125 12.2422C22.3125 13.4141 20.6419 14.3047 20.1863 15.4006C19.7475 16.4619 20.3194 18.2741 19.4569 19.1366C18.5944 19.9991 16.7822 19.4272 15.7209 19.8659C14.625 20.3216 13.7344 21.9922 12.5625 21.9922C11.3906 21.9922 10.5 20.3216 9.40406 19.8659C8.34375 19.4272 6.53062 19.9991 5.66812 19.1366Z" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.8125 12.9922L11.0625 15.2422L16.3125 9.99219" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      Milestone achieved
    </span>
    <span class="legend-item new_to_pipeline">
      <span class="legend-icon" aria-label="New to Pipeline">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;">
          <path d="M4.3125 12.2422H20.8125" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12.5625 3.99219V20.4922" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      New to pipeline
    </span>
  `;
  block.appendChild(legend);

  // add HR between filters and pipeline data
  const hr = document.createElement("hr");
  block.appendChild(hr);

  // Add event listeners to pills
  const allPills = [
    ...typeAndModalityPills.querySelectorAll(".filter-pill"),
    ...therapeuticAreaPills.querySelectorAll(".filter-pill"),
  ];
  allPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      // Toggle the active state of the pill
      pill.classList.toggle("active");

      // Get all active filters
      const activeFilters = allPills
        .filter((p) => p.classList.contains("active"))
        .map((p) => p.dataset.filter);

      // Render the pipeline based on active filters
      if (activeFilters.length === 0) {
        renderPipeline("All"); // Show all cards if no filters are active
      } else {
        renderPipeline(activeFilters); // Apply the selected filters
      }
    });
  });

  // Render the pipeline with the default filter (All)
  block.appendChild(pipelineContainer);
  renderPipeline("All");

  // Add expand/collapse functionality for "View more information"
  pipelineContainer
    .querySelectorAll(".lds-card__footer-link")
    .forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const moleculeId = link.getAttribute("data-molecule-id");
        const card = document.getElementById(`card-${moleculeId}`);
        const row = card.closest(".lds-row");
        const detailsBox = row.querySelector(".lds-card__details");

        // If the clicked card is already expanded, collapse ALL cards and details, reset all states and texts
        if (card.classList.contains("expanded")) {
          pipelineContainer.querySelectorAll(".lds-card").forEach((cardEl) => {
            cardEl.className = cardEl.className.replace(
              / lds-pill--[a-z0-9\-]+/gi,
              "",
            );
            cardEl.classList.remove("expanded");
          });
          pipelineContainer
            .querySelectorAll(".lds-card__footer-link")
            .forEach((btn) => {
              btn.textContent = "View more information";
              btn.classList.remove("active");
            });
          pipelineContainer
            .querySelectorAll(".lds-card__details")
            .forEach((box) => {
              box.style.display = "none";
              box.classList.remove("open");
              box.innerHTML = "";
              box.style.transition = "";
              box.style.maxHeight = "";
              box.style.overflow = "";
            });
          return;
        }

        // Otherwise, expand the clicked card and set active states (collapse all others first)
        pipelineContainer.querySelectorAll(".lds-card").forEach((cardEl) => {
          cardEl.className = cardEl.className.replace(
            / lds-pill--[a-z0-9\-]+/gi,
            "",
          );
          cardEl.classList.remove("expanded");
        });
        pipelineContainer
          .querySelectorAll(".lds-card__footer-link")
          .forEach((btn) => {
            btn.textContent = "View more information";
            btn.classList.remove("active");
          });
        pipelineContainer
          .querySelectorAll(".lds-card__details")
          .forEach((box) => {
            box.style.display = "none";
            box.classList.remove("open");
            box.innerHTML = "";
            box.style.transition = "";
            box.style.maxHeight = "";
            box.style.overflow = "";
          });

        const molecule = molecules.find((m) => m.id === moleculeId);
        const therapeuticArea =
          therapeuticAreaMap[molecule.therapeutic_area_id];
        const therapeuticAreaClass = therapeuticArea
          ?.toLowerCase()
          .replace(/\s+/g, "-");

        // Set the class on the details box for color theming
        detailsBox.className = `lds-card__details lds-pill--${therapeuticAreaClass}`;
        // Also set the color class on the selected card
        card.className = `lds-card lds-card--interactive lds-card--hover expanded lds-pill--${therapeuticAreaClass}`;

        let html = "";
        if (molecule.body_html || (molecule.news && molecule.news.length > 0)) {
          html += `
          <div class="lds-card__details-body">
            <div class="lds-card__details-col lds-card__details-col--left">
              <h4 class="lds-card__details-molecule-name">${molecule.title}</h4>
            </div>
            <div class="lds-card__details-col lds-card__details-col--right">
              ${molecule.body_html ? `<div class="lds-card__details-body-content">${molecule.body_html}</div>` : ""}
              ${
                molecule.news && molecule.news.length > 0
                  ? `
                <div class="lds-card__details-news">
                  <div class="news-date-range">NEWS (${newsDateRangeText})</div>
                  <ul>
                    ${molecule.news
                      .map(
                        (article) => `
                      <li>
                        ${article.type ? `<span class="lds-card__details-news-type">${article.type}</span> | ` : ""}
                        ${article.formattedDate ? `<span class="lds-card__details-news-date">${article.formattedDate}</span>` : ""}
                        <br>
                        <a href="${article.url}" target="_blank" rel="noopener">${article.title || article.url}</a>
                      </li>
                    `,
                      )
                      .join("")}
                  </ul>
                </div>
              `
                  : ""
              }
            </div>
          </div>
        `;
        } else {
          html += `<div class="lds-card__details-body"><div class="lds-card__details-molecule-name"><strong>${molecule.title}</strong></div><div>No additional information.</div></div>`;
        }
        detailsBox.innerHTML = html;
        detailsBox.style.display = "block";
        detailsBox.classList.add("open");
        detailsBox.style.transition = "";
        detailsBox.style.maxHeight = "";
        detailsBox.style.overflow = "";

        // Set active state on the clicked footer link
        link.textContent = "Collapse information";
        link.classList.add("active");
        card.classList.add("expanded");
      });
    });

  // Collect all news dates from all molecules
  const allNewsDates = molecules
    .flatMap((molecule) =>
      (molecule.news || []).map((article) => article.formattedDate),
    )
    .filter(Boolean)
    .map((dateStr) => new Date(dateStr));

  // Sort dates
  allNewsDates.sort((a, b) => a - b);

  let newsDateRangeText = "";
  if (allNewsDates.length > 0) {
    const options = { year: "numeric", month: "long", day: "2-digit" };
    const earliest = allNewsDates[0].toLocaleDateString(undefined, options);
    const latest = allNewsDates[allNewsDates.length - 1].toLocaleDateString(
      undefined,
      options,
    );
    newsDateRangeText = `${earliest} - ${latest}`;
  }

  // Append pipelineContainer after the legend
  block.appendChild(pipelineContainer);
}
