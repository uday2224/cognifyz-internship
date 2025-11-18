/*
  router.js — lightweight hash-based client hints:
  Changes document title and highlights nav links depending on #hash
  (non-invasive, server still serves pages)
*/
document.addEventListener('DOMContentLoaded', () => {
  function applyRoute() {
    const h = location.hash.replace('#','') || 'home';
    document.documentElement.dataset.route = h;
    // set title
    if (h === 'form') document.title = 'Form — Cognifyz Demo';
    else document.title = 'Cognifyz Internship — Home';
    // highlight nav links (if present)
    document.querySelectorAll('.nav a').forEach(a => {
      a.classList.toggle('active', (a.getAttribute('href')||'').includes(h) || (h === 'home' && a.getAttribute('href') === '/'));
    });
  }
  window.addEventListener('hashchange', applyRoute);
  applyRoute();
});
