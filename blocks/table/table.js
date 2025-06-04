import { moveInstrumentation } from "../../scripts/scripts.js";

function transformTableForMobile(rows, headers) {
  const mobileTable = document.createElement("div");
  mobileTable.setAttribute("role", "table");
  mobileTable.setAttribute(
    "aria-label",
    `Mobile view: Table with ${rows.length} rows. Each row contains header-value pairs.`,
  );
  mobileTable.classList.add("mobile-table");

  rows.forEach((row) => {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("mobile-row");

    headers.forEach((header, index) => {
      const groupContainer = document.createElement("div");
      groupContainer.classList.add("mobile-group");

      const headerCell = document.createElement("div");
      headerCell.classList.add("mobile-header");
      headerCell.setAttribute("role", "columnheader");
      headerCell.innerText = header;

      const valueCell = document.createElement("div");
      valueCell.classList.add("mobile-value");
      valueCell.setAttribute("role", "cell");
      valueCell.innerHTML = row.values[index] || ""; // Match header with value

      groupContainer.appendChild(headerCell);
      groupContainer.appendChild(valueCell);
      rowContainer.appendChild(groupContainer);
    });

    mobileTable.appendChild(rowContainer);
  });

  return mobileTable;
}

export default async function decorate(block) {
  const table = document.createElement("table");
  table.classList.add("custom-table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const header = !block.classList.contains("no-header");
  const headers = [];
  const rows = [];

  [...block.children].forEach((row, i) => {
    const tr = document.createElement("tr");
    moveInstrumentation(row, tr);

    [...row.children].forEach((cell, j) => {
      const td = document.createElement(i === 0 && header ? "th" : "td");

      if (i === 0 && header) {
        td.setAttribute("scope", "col");
        headers[j] = cell.innerText.trim();
      } else if (headers[j]) {
        td.setAttribute("data-label", headers[j]);
      }

      td.innerHTML = cell.innerHTML;
      tr.append(td);
    });

    if (i !== 0 || !header) {
      const rowData = {
        values: [...row.children].map((cell) => cell.innerHTML.trim()),
      };
      rows.push(rowData);
    }

    (i === 0 && header ? thead : tbody).append(tr);
  });

  table.append(thead, tbody);
  const numberOfRows = rows.length + (header ? 1 : 0);
  const numberOfColumns = headers.length;
  table.setAttribute(
    "aria-label",
    `Table with ${numberOfRows} rows and ${numberOfColumns} columns`,
  );

  const mobileTable = transformTableForMobile(rows, headers);

  function toggleView() {
    block.textContent = "";
    if (window.matchMedia("(max-width: 768px)").matches) {
      block.appendChild(mobileTable);
      mobileTable.focus();
    } else {
      block.appendChild(table);
      table.focus();
    }
  }

  toggleView();
  window.addEventListener("resize", toggleView);
}
