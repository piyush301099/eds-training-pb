import pushAdobeAnalyticsEvent from "../../utils/analytics/analytics.js";

export default function decorate(block) {
  const child = [...block.children];
  const tabTitlesArray = (child[0]?.textContent.trim() || "").split(",");
  const dropdownTitle = child[2]?.textContent.trim() || "";
  const parentDiv = block.parentElement?.parentElement;

  block.textContent = "";

  const contentDivs = [...parentDiv.children].slice(1);

  contentDivs.forEach((div, index) => {
    div.style.display = index === 0 ? "block" : "none";
    div.role = "tabpanel";
    div.ariaLabelledby = `tab-content-${index}`;
  });

  let selectedIndex = 0;

  const tabsContainer = document.createElement("div");
  tabsContainer.className = "tabs-component-container";

  const dropdownTitleElement = document.createElement("div");
  dropdownTitleElement.className =
    "tabs-dropdown-title lds-ringside-body-small";
  dropdownTitleElement.textContent = dropdownTitle;
  dropdownTitleElement.setAttribute("aria-label", dropdownTitle);

  const selectInputBox = document.createElement("div");
  selectInputBox.className = "select-input-box lds-ringside-body-medium";
  selectInputBox.tabIndex = 0;
  selectInputBox.setAttribute("role", "tab");
  selectInputBox.setAttribute("aria-expanded", "false");
  selectInputBox.setAttribute("aria-haspopup", "true");
  selectInputBox.setAttribute("aria-controls", "dropdown-options");
  selectInputBox.setAttribute("aria-owns", "dropdown-options");

  const selected = document.createElement("div");
  selected.className = "dropdown-selected";
  selected.textContent = tabTitlesArray[0] || "";
  selectInputBox.setAttribute("aria-label", selected.textContent);

  const optionsContainer = document.createElement("div");
  optionsContainer.className = "dropdown-options lds-ringside-body-medium";

  // Function to update both tabs and dropdown based on the selected index
  const updateView = () => {
    tabsContainer.querySelectorAll(".tab-item").forEach((tab, index) => {
      tab.classList.toggle("selected", index === selectedIndex);
      tab.ariaSelected = index === selectedIndex ? "true" : "false";
    });

    selected.textContent = tabTitlesArray[selectedIndex] || "";
    selectInputBox.setAttribute(
      "aria-label",
      tabTitlesArray[selectedIndex] || "",
    );

    contentDivs.forEach((div, index) => {
      div.style.display = index === selectedIndex ? "block" : "none";
    });

    // Push analytics event to adobeDataLayer
    pushAdobeAnalyticsEvent({
      event: "cta_click",
      eventinfo: {
        eventName: "Tab Click",
        linkText: selected.textContent || "", // Pass the tab title
        linkType: "", // No specific link type
        linkUrl: "", // No destination URL
        linkLocation: "Tabs Component", // Section name where the tab resides
        linkLabel: "", // Empty label
        userSelections: "", // Empty user selections
      },
      componentInfo: {
        componentName: "Tabs Component", // Component name
      },
    });
  };

  // Create tabs and dropdown options
  tabTitlesArray.forEach((title, index) => {
    const tab = document.createElement("button");
    tab.ariaLabel = title;
    tab.ariaControls = `tab-panel-${index}`;
    tab.ariaSelected = index === 0 ? "true" : "false";
    tab.role = "tab";
    tab.tabIndex = 0;
    tab.className = "tab-item lds-ringside-body-medium";
    tab.textContent = title;
    tab.dataset.index = index;

    if (index === 0) tab.classList.add("selected");

    tab.addEventListener("click", () => {
      selectedIndex = index;
      updateView();
    });

    tabsContainer.appendChild(tab);
    tabsContainer.role = "tablist";

    const option = document.createElement("div");
    option.className = "dropdown-option";
    option.textContent = title;
    option.setAttribute("aria-label", title);
    option.role = "option";
    option.ariaSelected = index === 0 ? "true" : "false";
    option.ariaControls = `tab-panel-${index}`;
    option.tabIndex = 0;
    option.dataset.index = index;

    const handleSelection = () => {
      selectedIndex = index;
      updateView();
      optionsContainer.style.display = "none";
      selectInputBox.classList.remove("open");
    };

    option.addEventListener("click", (event) => {
      event.stopPropagation();
      handleSelection();
    });

    option.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.stopPropagation();
        handleSelection();
      }
    });

    optionsContainer.appendChild(option);
  });

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    const isVisible = optionsContainer.style.display === "block";
    optionsContainer.style.display = isVisible ? "none" : "block";
    selectInputBox.classList.toggle("open", !isVisible);
    selectInputBox.setAttribute("aria-expanded", !isVisible ? "true" : "false");
  };

  selectInputBox.addEventListener("click", toggleDropdown);
  selectInputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") toggleDropdown();
  });

  document.addEventListener("click", (event) => {
    if (!selectInputBox.contains(event.target)) {
      optionsContainer.style.display = "none";
      selectInputBox.classList.remove("open");
    }
  });

  selectInputBox.appendChild(selected);
  selectInputBox.appendChild(optionsContainer);

  block.appendChild(dropdownTitleElement);
  block.appendChild(selectInputBox);
  block.appendChild(tabsContainer);
}
