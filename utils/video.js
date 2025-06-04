import { loadScript } from "../scripts/aem.js";

const KALTURA_PARTNER_ID = "1759891";
const KALTURA_UICONF_ID = "54959122";
let kalturaScriptLoaded = false;
let kalturaScriptLoadingPromise = null;

export default async function handleKalturaPlayer(entryId, playerId) {
  const container = document.getElementById(playerId);
  if (!container) {
    setTimeout(() => handleKalturaPlayer(entryId, playerId), 100);
    return;
  }
  if (container.dataset.kalturaInitialized === "true") {
    return;
  }
  if (!kalturaScriptLoaded) {
    if (!kalturaScriptLoadingPromise) {
      const scriptUrl = `https://cdnapisec.kaltura.com/p/${KALTURA_PARTNER_ID}/embedPlaykitJs/uiconf_id/${KALTURA_UICONF_ID}`;
      kalturaScriptLoadingPromise = loadScript(scriptUrl);
    }

    await kalturaScriptLoadingPromise;
    kalturaScriptLoaded = true;
  }

  if (typeof window.KalturaPlayer === "undefined") {
    setTimeout(() => handleKalturaPlayer(entryId, playerId), 100);
    return;
  }

  const kalturaPlayer = window.KalturaPlayer.setup({
    targetId: playerId,
    provider: {
      partnerId: KALTURA_PARTNER_ID,
      uiConfId: KALTURA_UICONF_ID,
    },
    playback: {
      autoplay: true,
      muted: true,
      loop: true,
    },
    textTrack: {
      mode: "off",
    },
    disableUserCache: true,
  });

  kalturaPlayer.loadMedia({ entryId });

  kalturaPlayer.addEventListener(kalturaPlayer.Event.Core.PLAYER_READY, () => {
    kalturaPlayer.setTextTrack(-1);
  });

  container.dataset.kalturaInitialized = "true";
}
