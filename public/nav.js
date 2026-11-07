// Marks JS as available (enables the mobile menu styles) and runs the mobile menu.
document.documentElement.classList.add("js");

function setMenu(open, restoreFocus) {
  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".menu-toggle");
  if (!menu || !toggle || menu.classList.contains("open") === open) return;

  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.documentElement.classList.toggle("no-scroll", open);
  document.getElementById("main")?.toggleAttribute("inert", open);
  if (!open && restoreFocus) toggle.focus();
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".menu-toggle")) {
    const menu = document.getElementById("menu");
    setMenu(!(menu && menu.classList.contains("open")));
  } else if (e.target.closest("#menu a")) {
    setMenu(false);
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false, true);
});

window
  .matchMedia("(min-width: 901px)")
  .addEventListener("change", (e) => { if (e.matches) setMenu(false); });

// Back/forward cache can restore a page with the menu open.
window.addEventListener("pageshow", () => setMenu(false));