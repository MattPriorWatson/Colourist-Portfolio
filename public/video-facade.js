// Swaps a poster link for the real video player when clicked.
document.addEventListener("click", (e) => {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const el = e.target.closest("[data-embed]");
  if (!el) return;
  e.preventDefault();

  const iframe = document.createElement("iframe");
  iframe.src = el.dataset.embed;
  iframe.title = el.dataset.title || "Video";
  iframe.allow = "autoplay; fullscreen; picture-in-picture";
  iframe.allowFullscreen = true;

  el.closest("[data-player]")?.classList.add("is-playing");
  el.replaceWith(iframe);
  iframe.focus();
});