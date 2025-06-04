export default async function decorate(block) {
  // Helper to get text from a child node by index
  function getTextFromChild(parent, index) {
    const child = parent.children[index];
    if (!child) return "";
    // Try to find a link or span, otherwise fallback to textContent
    const linkOrSpan = child.querySelector("a, span");
    return linkOrSpan
      ? linkOrSpan.textContent.trim()
      : child.textContent.trim();
  }

  // Helper to get href from a child node by index
  function getHrefFromChild(parent, index) {
    const child = parent.children[index];
    if (!child) return "#";
    const link = child.querySelector("a[href]");
    return link ? link.getAttribute("href") : "#";
  }

  // Convention: previous label/link at index 1, next label/link at index 3
  const previousPageName = getTextFromChild(block, 0);
  const previousPageLink = getHrefFromChild(block, 1);
  const nextPageName = getTextFromChild(block, 2);
  const nextPageLink = getHrefFromChild(block, 3);

  // Create navigation container
  const navigation = document.createElement("div");
  navigation.className = "navigation";
  navigation.setAttribute("role", "navigation");
  navigation.setAttribute("aria-label", "Executive Bio Pagination");

  // Previous nav
  const previousNav = document.createElement("div");
  previousNav.className = "nav-item previous";

  const previousLink = document.createElement("a");
  previousLink.href = previousPageLink;
  previousLink.className = "nav-link";
  previousLink.setAttribute(
    "aria-label",
    `Go to previous page: ${previousPageName}`,
  );

  const previousArrow = document.createElement("span");
  previousArrow.className = "arrow";
  previousArrow.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" aria-hidden="true" focusable="false">
      <path d="M16.875 10.5518H3.125" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8.75 4.92676L3.125 10.5518L8.75 16.1768" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const previousText = document.createElement("div");
  previousText.className = "text";

  const previousName = document.createElement("span");
  previousName.className = "name lds-ringside-body-large";
  previousName.textContent = previousPageName;

  const previousLabel = document.createElement("span");
  previousLabel.className = "label lds-ringside-body-small";
  previousLabel.textContent = "Previous";

  previousText.append(previousName, previousLabel);
  previousLink.append(previousArrow, previousText);
  previousNav.append(previousLink);

  // Next nav
  const nextNav = document.createElement("div");
  nextNav.className = "nav-item next";

  const nextLink = document.createElement("a");
  nextLink.href = nextPageLink;
  nextLink.className = "nav-link";
  nextLink.setAttribute("aria-label", `Go to next page: ${nextPageName}`);

  const nextArrow = document.createElement("span");
  nextArrow.className = "arrow";
  nextArrow.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" aria-hidden="true" focusable="false">
      <path d="M3.125 10.5518H16.875" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11.25 4.92676L16.875 10.5518L11.25 16.1768" stroke="#191919" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const nextText = document.createElement("div");
  nextText.className = "text";

  const nextName = document.createElement("span");
  nextName.className = "name lds-ringside-body-large";
  nextName.textContent = nextPageName;

  const nextLabel = document.createElement("span");
  nextLabel.className = "label lds-ringside-body-small";
  nextLabel.textContent = "Next";

  nextText.append(nextName, nextLabel);
  nextLink.append(nextText, nextArrow);
  nextNav.append(nextLink);

  // Append Previous and Next to Navigation
  navigation.append(previousNav, nextNav);

  // Clear block content and append navigation
  block.textContent = "";
  block.append(navigation);
}
