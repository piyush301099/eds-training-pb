export default function decorate(block) {
  const childElements = [...block.children];

  const getTextContent = (el) => el?.textContent.trim() || "";

  const [elementselector, spacerheight, dividercolor, topbottomspacing] = [
    getTextContent(childElements[0]),
    getTextContent(childElements[1]),
    getTextContent(childElements[2]),
    getTextContent(childElements[3]),
  ];

  block.textContent = "";

  const data = {
    id: "spacer-and-divider",
    fields: [
      {
        component: "select",
        name: "elementselector",
        label: "Element Selector",
        description: "Select the appropriate option",
        value: "divider",
        required: true,
        options: [
          { name: "Horizontal Divider", value: "divider" },
          { name: "Spacer", value: "spacer" },
        ],
      },
      {
        component: "select",
        name: "spacerheight",
        label: "Spacer height - Desktop",
        value: "small",
        description:
          "Select the appropriate spacer height. Mobile height will be auto calculated on selection made",
        options: [
          { name: "Small", value: "small" },
          { name: "Medium", value: "medium" },
          { name: "Large", value: "large" },
        ],
        condition: { "===": [{ var: "elementselector" }, "spacer"] },
      },
      {
        component: "select",
        name: "dividercolor",
        label: "Divider Color",
        description: "Select the Divider color",
        value: "primary",
        options: [
          { name: "Primary", value: "primary" },
          { name: "Secondary", value: "secondary" },
        ],
        condition: { "===": [{ var: "elementselector" }, "divider"] },
      },
      {
        component: "select",
        name: "topbottomspacing",
        label: "Top & Bottom spacing",
        value: "small",
        description: "Select the appropriate padding",
        options: [
          { name: "Small", value: "small" },
          { name: "Medium", value: "medium" },
          { name: "Large", value: "large" },
        ],
        condition: { "===": [{ var: "elementselector" }, "divider"] },
      },
    ],
  };

  const getDefaultValue = (fieldName) => {
    const field = data.fields.find((f) => f.name === fieldName);
    return field ? field.value : "";
  };

  const userInput = {
    elementselector:
      elementselector.toLowerCase() || getDefaultValue("elementselector"),
    spacerheight: spacerheight.toLowerCase() || getDefaultValue("spacerheight"),
    dividercolor: dividercolor.toLowerCase() || getDefaultValue("dividercolor"),
    topbottomspacing:
      topbottomspacing.toLowerCase() || getDefaultValue("topbottomspacing"),
  };

  const spacerDivider = document.createElement("div");
  spacerDivider.className = "spacer-divider";

  if (userInput) {
    const elementOptions = data.fields.find(
      (f) => f.name === "elementselector",
    ).options;
    const selectedOption = elementOptions.find(
      (opt) => opt.value === userInput.elementselector,
    );

    let element;
    if (selectedOption) {
      let className = "";
      if (userInput[selectedOption.value]) {
        className = `${selectedOption.value} ${selectedOption.value}-${userInput[selectedOption.value]}`;
      } else {
        let dynamicValue = userInput[selectedOption.value];
        if (!dynamicValue && selectedOption.value === data.fields[0].value) {
          const spacing =
            userInput.topbottomspacing || getDefaultValue("topbottomspacing");
          const color =
            userInput.dividercolor || getDefaultValue("dividercolor");
          className = `divider divider-${spacing} divider-${color}`;
        } else if (
          !dynamicValue &&
          data.fields.find((f) => f.name === selectedOption.value)
        ) {
          dynamicValue =
            userInput[selectedOption.value] ||
            getDefaultValue(selectedOption.value);
          className = `${selectedOption.value} ${selectedOption.value}-${dynamicValue}`;
        } else {
          const height =
            userInput.spacerheight || getDefaultValue("spacerheight");
          className = `${selectedOption.value} ${selectedOption.value}-${height}`;
        }
      }
      if (className) {
        element = document.createElement("div");
        element.className = className;
        if (selectedOption.value === data.fields[0].value) {
          element.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="863" height="2" viewBox="0 0 863 2" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M863 2L-1.74839e-07 1.99992L0 0L863 7.54459e-05L863 2Z"/></svg>';
        }
      }
    }

    if (element) {
      spacerDivider.appendChild(element);
    }
  }

  block.appendChild(spacerDivider);
}
