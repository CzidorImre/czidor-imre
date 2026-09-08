/* Microsoft Clarity loader.
   External file (not an inline snippet) because the CSP in /_headers forbids
   inline scripts. The project id comes from the data-clarity-id attribute set
   in BaseLayout.astro. The tag is only injected once the visitor has accepted
   analytics in the consent bar; site.js calls window.ciClarity.load(). */
(function () {
  var id = (document.currentScript && document.currentScript.dataset.clarityId) || '';
  var loaded = false;

  function load() {
    if (loaded || !id) return;
    loaded = true;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', id);

    /* We only get here once the visitor accepted analytics, so tell Clarity it
       may use its cookies. Ad storage stays denied - no marketing cookies.
       Queued by the stub above, so it is safe to call before the tag lands. */
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
  }

  window.ciClarity = { load: load };

  /* returning visitor who already accepted */
  try { if (localStorage.getItem('ci_consent') === 'granted') load(); } catch (e) {}

  /* "withdraw consent" link on the privacy page: forget the stored choice and
     send the visitor back to the home page, where the consent bar asks again */
  var reset = document.getElementById('consent-reset');
  if (reset) {
    reset.addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem('ci_consent'); } catch (err) {}
      location.href = '/';
    });
  }
})();
