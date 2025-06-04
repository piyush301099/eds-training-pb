/* eslint-disable no-param-reassign */
import { setCookie } from '@lds/util/cookies';
import { getCookieAcceptance } from '@lds/functions';
import { html } from 'lit-html';

// https://developer.kaltura.com/player/web/getting-started-web
export function addKalturaScript(autoplay = false, startTime = 0) {
  // if script already exists, don't add it again, init player and return early
  const existingScript = document.getElementById('lds-kaltura-player-script');
  if (existingScript) {
    // add queueMicrotask to ensure dom is accessible before we call initKalturaPlayer
    queueMicrotask(() => initKalturaPlayers(autoplay, startTime));
    return;
  }

  const newScript = document.createElement('script');
  newScript.setAttribute('id', 'lds-kaltura-player-script');
  newScript.setAttribute(
    'src',
    'https://cdnapisec.kaltura.com/p/1759891/embedPlaykitJs/uiconf_id/50748072'
  );
  // script doesn't exist, add it to the head and init player
  document.head.appendChild(newScript);
  newScript.onload = () => initKalturaPlayers(autoplay, startTime);
}

export function initKalturaPlayers(autoplay = false, startTime = 0) {
  const videoPlayers = document.querySelectorAll('.kaltura_player');
  if (!videoPlayers) return;
  videoPlayers.forEach((player) => {
    const videoId = player.id.split('kaltura_player_').pop();
    initKalturaPlayerById(videoId, autoplay, startTime);
  });
}
let kalturaPlayer = null;
export function initKalturaPlayerById(
  videoId,
  autoplay = false,
  startTime = 0
) {
  startTime = timeToSeconds(startTime);
  const parentDiv = document.getElementById(`kaltura_player_${videoId}`);
  const playerContainer = parentDiv.querySelector('.kaltura-player-container');

  if (!playerContainer) {
    // eslint-disable-next-line no-undef
    kalturaPlayer = KalturaPlayer.setup({
      targetId: `kaltura_player_${videoId}`,
      logLevel: 'DEBUG',
      provider: {
        partnerId: 1759891,
        uiConfId: 50748072,
      },
      playback: {
        autoplay,
      },
      plugins: {
        'playkit-js-info': {},
      },
      sources: {
        startTime,
      },
    });

    kalturaPlayer.loadMedia({ entryId: videoId });
  } else {
    kalturaPlayer.currentTime = startTime;
    if (autoplay) {
      kalturaPlayer.play();
    }
  }
}

export function getBackgroundImage(videoId) {
  return `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`;
}

export function displayInterstitial() {
  const cookie = getCookieAcceptance('lds_youtube_affirm');
  if (!cookie) return 'active';
  return 'hidden';
}

export function displayVideo() {
  const cookie = getCookieAcceptance('lds_youtube_affirm');
  if (!cookie) return 'hidden';
  return 'active';
}
export function consentToYoutube() {
  setCookie('lds_youtube_affirm', '1');
  const interstitial = document.querySelector(
    '.with-interstitial  .lds-youtube-video-player-interstitial'
  );
  const video = document.querySelector(
    '.with-interstitial .lds-youtube-video-wrapper'
  );
  interstitial.classList.add('hidden');
  video.classList.remove('hidden');
}

export function getKalturaThumb(videoId, partnerId) {
  return html`<img
    src="https://cdnsecakmi.kaltura.com/p/${partnerId}/thumbnail/entry_id/${videoId}/width/400"
  />`;
}

export function timeToSeconds(timeString = '0:00') {
  // if timeString is already a number, return it
  if (typeof timeString === 'number') return timeString;
  const [minutes, seconds] = timeString.split(':').map(Number);
  return minutes * 60 + seconds;
}
