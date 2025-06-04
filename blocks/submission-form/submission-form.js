export default function decorate(block) {
  const iframeContainer = document.createElement("div");
  iframeContainer.className = "submission-iframe-container";

  const iframe = document.createElement("iframe");
  iframe.title = "Security vulnerability submission form";
  iframe.src =
    "https://bugcrowd.com/82855e8f-f0f8-4d13-9d81-15c09777607e/external/report";
  iframe.className = "submission-form-iframe";
  iframe.scrolling = "no";
  iframe.referrerPolicy = "origin";
  iframe.allow = "clipboard-read; clipboard-write";

  iframeContainer.appendChild(iframe);

  block.innerHTML = "";
  block.appendChild(iframeContainer);
}
