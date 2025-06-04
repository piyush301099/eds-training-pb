export default function heroScrollDown({
  heroId,
} = {}) {
  let hero;
  try {
    // Get the unique hero element
    hero = document.getElementById(heroId);
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(`
    LDS ERROR: heroScrollDown function encountered an unexpected exception creating an HTML element object from the provided Hero component IDs
    Exception: ${ex.message}
    -- heroId (the unique ID attribute of the LDS Hero component to scroll down): ${heroId}
    -- hero HTML Element: ${hero}
    `);
    return;
  }

  let heroBottom;
  try {
    // Get the hero element's RELATIVE bottom coordinate on the page
    // it will vary if the page has been scrolled
    // effectively it is the location of the bottom of the hero from the top of the VIEWPORT
    heroBottom = hero.getBoundingClientRect().bottom;
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(`
    LDS ERROR: heroScrollDown function encountered an unexpected exception getting the bounding coordinates of the LDS Hero component
    Exception: ${ex.message}
    -- heroId (the unique ID attribute of the LDS Hero component to scroll down): ${heroId}
    -- hero HTML Element: ${hero}
    -- heroBottom (hero.getBoundingClientRect().bottom): ${heroBottom}
    `);
    return;
  }

  let scrollTopOffset;
  try {
    // Get the vertical location of the viewport RELATIVE to the top of the page
    // If page has not been scrolled this value should be zero
    // effectively it is the vertical distance from the top of the page it has been scrolled
    scrollTopOffset = document.documentElement.scrollTop;
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.error(`
    LDS ERROR: heroScrollDown function encountered an unexpected exception getting the current position the page has been scrolled from the top.
    Exception: ${ex.message}
    -- heroId (the unique ID attribute of the LDS Hero component to scroll down): ${heroId}
    -- hero HTML Element: ${hero}
    -- heroBottom (hero.getBoundingClientRect().bottom): ${heroBottom}
    -- scrollTopOffset (document.documentElement.scrollTop): ${scrollTopOffset}
    `);
    return;
  }

  // TODO: Once we build layouts with "sticky" elements that are stuck to the top of the page but
  //       don't scroll with it such as cookie banners or the header; this function will need to be
  //       revisited to compute the height of any stickied elements to subtract that from the
  //       final scroll position so that content does not scroll under stickied content.
  const stickyTopElementsOffset = 0;

  if (heroBottom && (scrollTopOffset || scrollTopOffset === 0)) {
    try {
      // The window.scrollTo function expects an ABSOLUTE location on the page
      // We need to know where the bottom of the hero is relative to the absolute top of the page NOT the viewport
      // Since heroBottom is where it is on the viewport we need to ADD in any distance scrolled vertically
      // MINUS anything that might be sticky to the top of the viewport that we don't want to scroll under
      const scrollYPOS = (heroBottom + scrollTopOffset) - stickyTopElementsOffset;
      // Attempt to scroll the window to the location of the bottom of the hero element
      if (scrollYPOS > 0) {
        window.scrollTo({
          top: scrollYPOS,
          left: 0,
          behavior: 'smooth',
        });
      } else {
        // GNDN if we can't scroll, but warn
        // eslint-disable-next-line no-console
        console.warn(`
        LDS WARNING: heroScrollDown function attempted to scroll the page to an invalid scroll position; scroll effect aborted
        -- heroId (the unique ID attribute of the LDS Hero component to scroll down): ${heroId}
        -- hero HTML Element: ${hero}
        -- heroBottom (hero.getBoundingClientRect().bottom): ${heroBottom}
        -- scrollTopOffset (document.documentElement.scrollTop): ${scrollTopOffset}
        -- Computed Scroll to Position: ${scrollYPOS}
        `);
      }
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(`
      LDS ERROR: heroScrollDown function encountered an unexpected exception invoking the JavaScript scrollTo() function to scroll to the bottom of the hero element
      Exception: ${ex.message}
      -- heroId (the unique ID attribute of the LDS Hero component to scroll down): ${heroId}
      -- hero HTML Element: ${hero}
      -- heroBottom (hero.getBoundingClientRect().bottom): ${heroBottom}
      -- scrollTopOffset (document.documentElement.scrollTop): ${scrollTopOffset}
      `);
    }
  } else {
    // eslint-disable-next-line no-console
    console.error(`
    LDS ERROR: heroScrollDown function failed unexpectedly; either the heroBottom or scrollTopOffset values were falsey
    -- heroId (the unique ID attribute of the LDS Hero component to scroll down): ${heroId}
    -- hero HTML Element: ${hero}
    -- heroBottom (hero.getBoundingClientRect().bottom): ${heroBottom}
    -- scrollTopOffset (document.documentElement.scrollTop): ${scrollTopOffset}
    `);
  }
}
