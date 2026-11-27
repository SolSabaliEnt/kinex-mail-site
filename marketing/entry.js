// Public marketing entry only. Existing hash routes and Auth callback URLs are untouched.
(function () {
  const host = window.location.hostname;
  const page = host === "mail.kinexcore.com" ? "mail" : (host === "www.kinexcore.com" || host === "kinexcore.com") ? "core" : null;
  if (page && window.location.pathname === "/" && !window.location.search && !window.location.hash) {
    window.location.replace("/marketing/" + page + ".html");
  }
})();
