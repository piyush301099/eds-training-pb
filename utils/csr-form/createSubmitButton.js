function createSubmitButton() {
  const button = document.createElement("button");
  button.type = "submit";
  button.className = "form-submit";
  button.setAttribute("aria-label", "Search CSR synopses");
  button.textContent = "Search";

  const svg = document.createElement("span");
  svg.className = "arrow-svg";
  svg.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path d="M3.75 12.5469H20.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.5 5.79688L20.25 12.5469L13.5 19.2969" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  button.appendChild(svg);
  return button;
}

export default createSubmitButton;
