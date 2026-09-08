/* ═══════════════════════════════════════════════════════════
   CZIDOR IMRE — phone reveal
   Shared decode/reveal for every <PhoneReveal /> on the page.
   Kept as an external file (not an Astro hoisted script) so it is
   served same-origin and passes the site's script-src 'self' CSP.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const buttons = () => document.querySelectorAll('[data-phone-target]');

  function reveal(btn) {
    const link = document.getElementById(btn.dataset.phoneTarget);
    if (!link) return;
    const number = atob(btn.dataset.phone);
    link.href = 'tel:' + number.replace(/\s+/g, '');
    link.querySelector('[data-phone-num]').textContent = number;
    link.hidden = false;
    const wasFocused = document.activeElement === btn;
    btn.remove();
    if (wasFocused) link.focus();
  }

  buttons().forEach(btn => btn.addEventListener('click', () => reveal(btn)));

  /* The A4 profile sheet is meant to be printed and handed over, so put the
     number on the page before the print dialog renders it. */
  window.addEventListener('beforeprint', () => buttons().forEach(reveal));
})();
