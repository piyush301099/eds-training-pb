function createInput(type, name, labelText) {
  const label = document.createElement("label");
  label.textContent = labelText;
  label.setAttribute("for", `input-${name}`);
  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.id = `input-${name}`;
  input.placeholder = labelText;
  input.className = "form-input";
  input.setAttribute("aria-label", labelText);
  label.appendChild(input);
  return label;
}

export default createInput;
