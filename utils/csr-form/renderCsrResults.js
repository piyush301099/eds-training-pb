function renderCsrResults(container, results = []) {
  const resultsWrapper = document.createElement("div");
  resultsWrapper.setAttribute("data-v-a46ee3d2", "");

  // Header
  const header = document.createElement("h3");
  header.setAttribute("data-v-a46ee3d2", "");
  header.className = "medium";
  header.textContent = "CSR Search Results";
  resultsWrapper.appendChild(header);

  // Results count
  const count = document.createElement("h3");
  count.setAttribute("data-v-a46ee3d2", "");
  count.textContent = `# Results: ${results.length}`;
  resultsWrapper.appendChild(count);

  results.forEach((result) => {
    const resultBlock = document.createElement("div");
    resultBlock.setAttribute("data-v-a46ee3d2", "");

    const inner = document.createElement("div");
    inner.setAttribute("data-v-c4decbf2", "");
    inner.setAttribute("data-v-a46ee3d2", "");

    // Indication
    const indication = document.createElement("h2");
    indication.setAttribute("data-v-c4decbf2", "");
    indication.className = "light";
    indication.textContent = `Indication: ${result.indication}`;
    inner.appendChild(indication);

    // Title
    const title = document.createElement("h5");
    title.setAttribute("data-v-c4decbf2", "");
    title.className = "csr-title";
    title.textContent = result.title;
    inner.appendChild(title);

    // PDF Link
    const link = document.createElement("a");
    link.setAttribute("data-v-c4decbf2", "");
    link.setAttribute("aria-label", "Read Synopsis (opens in a new tab)");
    link.href = result.pdf;
    link.target = "_blank";
    link.className = "lds-link";
    link.textContent = "Read Synopsis";
    inner.appendChild(link);

    inner.appendChild(document.createElement("br"));
    inner.appendChild(document.createElement("br"));

    // Table
    const tableContainer = document.createElement("div");
    tableContainer.setAttribute("data-v-c4decbf2", "");
    tableContainer.className = "search-result lds-table-container md-break";

    const table = document.createElement("table");
    table.id = result.trialId;
    table.setAttribute("role", "table");
    table.className = "lds-table layout-fixed flat";

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    [
      "Generic Name",
      "NCT Number",
      "Trial ID",
      "Phase",
      "Lilly Trial Alias",
    ].forEach((col) => {
      const th = document.createElement("th");
      th.setAttribute("scope", "col");
      const div = document.createElement("div");
      div.textContent = col;
      th.appendChild(div);
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    const row = document.createElement("tr");
    row.setAttribute("role", "row");

    // Generic Name
    const thRow = document.createElement("th");
    thRow.setAttribute("role", "rowheader");
    thRow.setAttribute("scope", "row");
    const spanGen = document.createElement("span");
    spanGen.textContent = result.genericName;
    thRow.appendChild(spanGen);
    row.appendChild(thRow);

    // NCT Number
    const tdNct = document.createElement("td");
    tdNct.setAttribute("role", "cell");
    const spanNctTag = document.createElement("span");
    spanNctTag.className = "col-tag";
    spanNctTag.textContent = "NCT Number:";
    tdNct.appendChild(spanNctTag);
    const spanNct = document.createElement("span");
    spanNct.textContent = result.nctNumber || "";
    tdNct.appendChild(spanNct);
    row.appendChild(tdNct);

    // Trial ID
    const tdTrial = document.createElement("td");
    tdTrial.setAttribute("role", "cell");
    const spanTrialTag = document.createElement("span");
    spanTrialTag.className = "col-tag";
    spanTrialTag.textContent = "Trial ID:";
    tdTrial.appendChild(spanTrialTag);
    const spanTrial = document.createElement("span");
    spanTrial.textContent = result.trialId;
    tdTrial.appendChild(spanTrial);
    row.appendChild(tdTrial);

    // Phase
    const tdPhase = document.createElement("td");
    tdPhase.setAttribute("role", "cell");
    const spanPhaseTag = document.createElement("span");
    spanPhaseTag.className = "col-tag";
    spanPhaseTag.textContent = "Phase:";
    tdPhase.appendChild(spanPhaseTag);
    const spanPhase = document.createElement("span");
    spanPhase.textContent = result.phase;
    tdPhase.appendChild(spanPhase);
    row.appendChild(tdPhase);

    // Lilly Trial Alias
    const tdAlias = document.createElement("td");
    tdAlias.setAttribute("role", "cell");
    const spanAliasTag = document.createElement("span");
    spanAliasTag.className = "col-tag";
    spanAliasTag.textContent = "Lilly Trial Alias:";
    tdAlias.appendChild(spanAliasTag);
    const spanAlias = document.createElement("span");
    spanAlias.textContent = result.alias;
    tdAlias.appendChild(spanAlias);
    row.appendChild(tdAlias);

    tbody.appendChild(row);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    inner.appendChild(tableContainer);

    inner.appendChild(document.createElement("br"));

    // HR
    const hr = document.createElement("hr");
    hr.setAttribute("data-v-c4decbf2", "");
    hr.className = "lds-hr";
    hr.style.width = "100%";
    inner.appendChild(hr);

    resultBlock.appendChild(inner);
    resultsWrapper.appendChild(resultBlock);
  });

  container.appendChild(resultsWrapper);
}

export default renderCsrResults;
