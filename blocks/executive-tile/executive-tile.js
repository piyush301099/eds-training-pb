import { createOptimizedPicture, getMetadata } from "../../scripts/aem.js";
import { createCTAButton, createSocialLink } from "../../utils/cta.js";

export default function decorate(block) {
  const getTrimmedText = (el) => el?.textContent?.trim() || "";

  const [
    image,
    imageAlt,
    name,
    designation,
    isInstagram,
    instagramUrl,
    isX,
    xUrl,
    isLinkedIn,
    linkedInUrl,
    ctaLabel,
    ctaType,
    executiveBioFile,
    ctaAsset,
    executiveTileAriaLabel,
  ] = block.children;

  block.textContent = "";

  const container = document.createElement("div");
  container.className = "content-container";

  // Executive Image
  if (image) {
    const imgSrc = image.querySelector("img")?.src;
    const imgAlt = getTrimmedText(imageAlt) || "Executive photo";
    if (imgSrc) {
      const executiveImage = createOptimizedPicture(imgSrc, imgAlt, false, [
        { width: 400 },
      ]);
      executiveImage.className = "executive-tile-image";
      container.append(executiveImage);
    }
  }

  const info = document.createElement("div");
  info.className = "executive-tile-info";

  const infoContent = document.createElement("div");
  infoContent.className = "executive-tile-info-content";

  // Divider
  const divider = document.createElement("div");
  divider.className = "executive-tile-divider";
  infoContent.append(divider);

  // Executive Name
  const executiveName = document.createElement("h2");
  executiveName.className = "lds-ringside-heading-2 executive-tile-name";
  executiveName.textContent =
    getTrimmedText(name) || getMetadata("og:title") || "";
  infoContent.append(executiveName);

  // Executive Designation
  const executiveDesignation = document.createElement("p");
  executiveDesignation.className =
    "lds-ringside-caption executive-tile-designation";
  executiveDesignation.textContent =
    getTrimmedText(designation) || getMetadata("description") || "";
  infoContent.append(executiveDesignation);

  // Socials
  const socials = document.createElement("div");
  socials.className = "executive-tile-socials";

  if (getTrimmedText(isInstagram) === "true" && getTrimmedText(instagramUrl)) {
    const ig = createSocialLink(instagramUrl, "Instagram", "executive-tile", [
      "executive-tile-social",
      "instagram",
    ]);
    if (ig) socials.append(ig);
  }
  if (getTrimmedText(isX) === "true" && getTrimmedText(xUrl)) {
    const x = createSocialLink(xUrl, "X", "executive-tile", [
      "executive-tile-social",
      "x",
    ]);
    if (x) socials.append(x);
  }
  if (getTrimmedText(isLinkedIn) === "true" && getTrimmedText(linkedInUrl)) {
    const li = createSocialLink(linkedInUrl, "LinkedIn", "executive-tile", [
      "executive-tile-social",
      "linkedin",
    ]);
    if (li) socials.append(li);
  }
  infoContent.append(socials);

  info.append(infoContent);

  // Download CTA Button
  if (getTrimmedText(ctaLabel) !== "") {
    const ctaFilledButton = createCTAButton({
      action: "navigation",
      type: ctaType?.textContent.trim(),
      variation: "cta-button-filled",
      label: getTrimmedText(ctaLabel),
      href:
        executiveBioFile.querySelector("a").href ||
        executiveBioFile.textContent.trim(),
      ariaLabel: executiveTileAriaLabel?.textContent.trim(),
      ctaAsset,
      icon: "download-icon",
      componentName: "Executive Tile Component",
    });
    if (ctaFilledButton) {
      info.append(ctaFilledButton);
    }
  }

  container.append(info);
  block.append(container);
}
