import pushAdobeAnalyticsEvent from "./analytics/analytics.js";
import { decorateIcon, getMetadata } from "./common.js";

export default async function createBreadcrumbs(firstBlock) {
  let urlPath = window.location.origin;
  const enableBreadcrumbs = getMetadata("enablebreadcrumb");
  const breadcrumbType = getMetadata("breadcrumbtype");
  if (!enableBreadcrumbs) return;

  if (urlPath.includes("author")) {
    urlPath = urlPath.includes("author-p153303-e1585520")
      ? "https://dev--ewi-lilly-com-block-library--elilillyco.aem.live"
      : "https://qa--ewi-lilly-com-block-library-qa--elilillyco.aem.live";
  }

  const api = `${urlPath}/api-breadcrumb.json`;
  const title = getMetadata("og:title");

  let data;
  try {
    const response = await fetch(api);
    if (!response.ok) return;
    data = await response.json();
  } catch {
    return;
  }

  // Build pageArray and crumbs
  const pageArray = [];
  data.data.forEach((item) => {
    if (item.pageTitle === title) {
      let tempPage = item.path;
      while (tempPage !== "") {
        pageArray.push(tempPage);
        const lastSlashIdx = tempPage.lastIndexOf("/");
        if (lastSlashIdx > 0) {
          tempPage = tempPage.substring(0, lastSlashIdx);
        } else {
          break;
        }
      }
    }
  });

  const crumbs = pageArray
    .map((pageItem) => {
      const match = data.data.find((item) => pageItem === item.path);
      if (match) {
        const pageUrl = match.url.includes("author")
          ? match.url.includes("author-p153303-e1585520")
            ? `${urlPath}/content/ewi-lilly-com-block-library${match.path}`
            : `${urlPath}/content/ewi-lilly-com-block-library-qa${match.path}`
          : `${urlPath}${match.path}`;
        return {
          pageTitle: match.pageTitle,
          pageUrl,
        };
      }
      return null;
    })
    .filter(Boolean);

  if (!firstBlock || crumbs.length < 2) return;

  const container = document.createElement("div");
  container.className = "breadcrumb-container";

  const homePageContainer = document.createElement("a");
  homePageContainer.className = "breadcrumb-home-page-container";
  homePageContainer.tabIndex = 0;
  const homeIcon = document.createElement("span");
  homeIcon.className = "icon-home-page";
  decorateIcon(homeIcon, "", "home page icon");
  homePageContainer.appendChild(homeIcon);
  container.appendChild(homePageContainer);

  const ellipseDropdown = document.createElement("div");
  ellipseDropdown.className = "breadcrumb-ellipse-dropdown";
  ellipseDropdown.style.display = "none";

  const reversedCrumbs = crumbs.slice().reverse();
  homePageContainer.href = reversedCrumbs[0].pageUrl;

  const addDivider = (parent, idx, arr) => {
    if (idx < arr.length - 1) {
      const divider = document.createElement("span");
      divider.textContent = " / ";
      divider.className = "breadcrumb-divider";
      parent.appendChild(divider);
    }
  };

  const createCrumb = (crumb, isLink = true) => {
    const el = document.createElement(isLink ? "a" : "p");
    el.className = "breadcrumb-item";
    el.textContent = crumb.pageTitle;
    el.setAttribute("aria-label", crumb.pageTitle);
    if (isLink) {
      el.href = crumb.pageUrl;
      el.classList.add("breadcrumb-link");
      el.tabIndex = 0;
      const eventsData = {
        event: "link_click",
        eventinfo: {
          eventName: "Breadcrumb Click",
          linkText: crumb.pageTitle,
          linkType: "Internal",
          linkUrl: crumb.pageUrl,
          linkLocation: "Breadcrumb",
          linkLabel: crumb.pageTitle,
        },
        componentInfo: {
          componentName: "Breadcrumb",
        },
      };
      el.addEventListener("click", () => {
        pushAdobeAnalyticsEvent(eventsData);
      });
    }
    return el;
  };

  if (
    breadcrumbType === "partial" ||
    window.matchMedia("(max-width: 950px)").matches
  ) {
    const homeCrumb = createCrumb(reversedCrumbs[0], false);
    homeCrumb.classList.add("home-page-breadcrumb");
    homePageContainer.appendChild(homeCrumb);
    addDivider(container, 0, reversedCrumbs);

    for (let i = 1; i < reversedCrumbs.length - 1; i += 1) {
      const dropdownItem = createCrumb(reversedCrumbs[i]);
      dropdownItem.className = "dropdown-item";
      ellipseDropdown.appendChild(dropdownItem);
    }

    const ellipseContainer = document.createElement("div");
    ellipseContainer.className = "breadcrumb-ellipse-container";
    const ellipse = document.createElement("span");
    ellipse.textContent = "...";
    ellipse.tabIndex = 0;
    ellipse.className = "breadcrumb-ellipse";
    const toggleDropdown = (e) => {
      e.stopPropagation();
      ellipseDropdown.style.display =
        ellipseDropdown.style.display === "none" ? "flex" : "none";
    };
    ellipse.addEventListener("click", toggleDropdown);
    ellipse.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleDropdown(e);
      }
    });
    document.addEventListener("click", (e) => {
      if (!ellipse.contains(e.target) && !ellipseDropdown.contains(e.target)) {
        ellipseDropdown.style.display = "none";
      }
    });
    ellipseContainer.appendChild(ellipse);
    ellipseContainer.appendChild(ellipseDropdown);
    container.appendChild(ellipseContainer);
    addDivider(container, 1, reversedCrumbs);

    const lastCrumb = createCrumb(
      reversedCrumbs[reversedCrumbs.length - 1],
      false,
    );
    container.appendChild(lastCrumb);
  } else {
    reversedCrumbs.forEach((crumb, idx, arr) => {
      const isLast = idx === arr.length - 1;
      const isFirst = idx === 0;
      const crumbEl = createCrumb(crumb, !isLast && !isFirst);
      if (idx === 0) {
        homePageContainer.appendChild(crumbEl);
        homeIcon.href = crumb.pageUrl;
      } else {
        container.appendChild(crumbEl);
      }
      addDivider(container, idx, arr);
    });
  }

  if (firstBlock.classList.contains("hero")) {
    const contentWrapper = firstBlock.querySelector(".content-wrapper");
    if (contentWrapper) {
      contentWrapper.insertBefore(container, contentWrapper.firstChild);
      container.classList.add("hero-breadcrumb");
    } else {
      firstBlock.insertBefore(container, firstBlock.firstChild);
      container.classList.add("hero-breadcrumb");
    }
  } else {
    firstBlock.appendChild(container);
    container.classList.add("breadcrumb-top-positioned");
  }
}
