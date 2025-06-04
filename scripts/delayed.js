window.adobeDataLayer = window.adobeDataLayer || [];
const { adobeDataLayer } = window;
const { lang: htmlLang } = document.documentElement || {};
const { href } = window.location;
let environmentName;
if (href.startsWith('https://qa--ewi-lilly-com-block-library-qa--elilillyco.aem.page') || href.includes('https://qa--ewi-lilly-com-block-library-qa--elilillyco.aem.page')) {
  environmentName = 'QA';
} else if (href.startsWith('https://dev--ewi-lilly-com-block-library--elilillyco.aem.page') || href.includes('https://dev--ewi-lilly-com-block-library--elilillyco.aem.page')) {
  environmentName = 'DEV';
} else {
  environmentName = 'Unknown Environment';
}
const { userAgent } = navigator;
let deviceType;
if (/android/i.test(userAgent)) {
  deviceType = 'Android';
} else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
  deviceType = 'iOS';
} else if (/Macintosh/i.test(userAgent)) {
  deviceType = 'Mac';
} else if (/Windows/i.test(userAgent)) {
  deviceType = 'Windows';
} else if (/Linux/i.test(userAgent)) {
  deviceType = 'Linux';
} else {
  deviceType = 'Unknown Device';
}
let browserType;
if (/Chrome/i.test(userAgent) && !/Edge|Edg/i.test(userAgent)) {
  browserType = 'Chrome';
} else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) {
  browserType = 'Safari';
} else if (/Edge|Edg/i.test(userAgent)) {
  browserType = 'Edge';
} else {
  browserType = 'Unknown Browser';
}

/**
* Pre-hides the body to avoid flicker in Adobe Target by applying temporary styles.
* @param {Document} doc - The document object.
* @param {string} style - The CSS style to apply.
* @param {number} timeout - The duration in milliseconds before removing the style.
*/
function adobepreload(win, doc, style, timeout) {
  const STYLE_ID = 'at-body-style';

  function getParent() {
    return doc.getElementsByTagName('head')[0];
  }

  function addStyle(parent, id, css) { // Renamed 'style' to 'css' to avoid conflict
    if (!parent) {
      return;
    }

    const styleElement = doc.createElement('style'); // Renamed 'style' to 'styleElement'
    styleElement.id = id;
    styleElement.innerHTML = css;
    parent.appendChild(styleElement);
  }

  function removeStyle(parent, id) {
    if (!parent) {
      return;
    }

    const styleElement = doc.getElementById(id); // Renamed 'style' to 'styleElement'

    if (!styleElement) {
      return;
    }

    parent.removeChild(styleElement);
  }

  addStyle(getParent(), STYLE_ID, style);
  setTimeout(() => {
    removeStyle(getParent(), STYLE_ID);
  }, timeout);
}

// Explicitly call the function
adobepreload(window, document, 'body {opacity: 0 !important}', 3000);

adobeDataLayer.push({
  event: 'page_view',
  pageInfo: {
    pageName: document.title,
    pageURL: window.location.href,
    environment: environmentName,
    businessCountryLanguage: htmlLang,
  },
  applicationInfo: {
    applicationType: browserType,
    applicationOS: deviceType,
  },
});
