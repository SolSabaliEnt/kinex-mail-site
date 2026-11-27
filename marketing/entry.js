// Root surface selector. Never redirect a public homepage.
(function () {
  "use strict";
  const script = document.currentScript;
  const product = script && script.dataset.kinexRoot;
  if (product !== "core" && product !== "mail") return; // unchanged source/dev entry
  const sections = new Set(["#top", "#overview", "#capabilities", "#access", ...(product === "mail" ? ["#workspaces", "#organization"] : [])]);
  function selectSurface() {
    const { pathname, search, hash } = window.location;
    const root = pathname === "/" || pathname === "/index.html" || pathname === "/mail.html";
    // Preserve every nonempty query and all non-section hashes for the app.
    return root && !search && (!hash || sections.has(hash)) ? "marketing" : "app";
  }
  const surface = selectSurface();
  document.documentElement.dataset.kinexSurface = surface;
  const style = document.getElementById("kinex-marketing-style");
  if (surface === "marketing") style.media = "all";
  else document.title = script.dataset.appTitle;
  let reloading = false;
  function reconcile(event) {
    if (selectSurface() === surface) return;
    event?.stopImmediatePropagation();
    if (!reloading) { reloading = true; window.location.reload(); }
  }
  window.addEventListener("hashchange", reconcile, true);
  window.addEventListener("popstate", reconcile, true);
  window.addEventListener("pageshow", event => { if (event.persisted) reconcile(event); }, true);
  document.addEventListener("DOMContentLoaded", function () {
    const assets = document.getElementById("kinex-app-assets");
    const home = document.getElementById("kinex-public-home");
    const root = document.getElementById("root");
    if (surface === "marketing") {
      assets.remove();
      root.remove();
      const motion = document.createElement("script");
      motion.src = "/marketing/site.js";
      document.body.append(motion);
      return;
    }
    home.remove();
    style.remove();
    document.body.removeAttribute("class");
    const nodes = [...assets.content.children];
    for (const node of nodes) {
      if (node.tagName === "LINK") document.head.append(node.cloneNode(true));
    }
    for (const node of nodes) {
      if (node.tagName !== "SCRIPT") continue;
      const module = document.createElement("script");
      for (const attr of node.attributes) module.setAttribute(attr.name, attr.value);
      document.head.append(module);
    }
    assets.remove();
  }, { once: true });
})();
