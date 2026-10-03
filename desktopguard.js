/* Loki The Wolf — desktopguard.js (v2)
 * Situs khusus desktop/PC. Di HP/tablet, SELURUH isi halaman disembunyikan
 * dan diganti satu layar penuh "Desktop only". Game tidak akan tampil sama sekali.
 * Pasang paling atas di <head>, sebelum script lain:
 * <script src="desktopguard.js"></script>
 */
(function () {
  var ua = navigator.userAgent || '';
  var mobileUA = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile|BlackBerry|webOS/i.test(ua);
  var ipadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  // Cek touch-only DIHAPUS: HP yang pakai "Desktop site" Chrome sekarang lolos.
  if (!(mobileUA || ipadOS)) return;

  window.__DESKTOP_BLOCKED = true;

  // 1) Sembunyikan semua isi halaman asli secepatnya (sebelum body ke-render)
  var css = document.createElement('style');
  css.textContent =
    'html,body{height:100%!important;margin:0!important;overflow:hidden!important;background:#050b1c!important}' +
    'body>*:not(#dg-block){display:none!important}' +
    '#dg-block{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;' +
    'background:radial-gradient(ellipse at 50% 30%,#112240 0%,#050b1c 70%)}' +
    '#dg-block .box{max-width:420px;text-align:center;padding:32px 24px;border:1px solid rgba(232,201,106,.4);border-radius:12px;' +
    'background:rgba(10,22,40,.85);box-shadow:0 0 40px rgba(106,180,255,.15)}' +
    '#dg-block h1{font:900 26px/1.2 Cinzel,serif;letter-spacing:.14em;color:#e8c96a;margin:0 0 6px}' +
    '#dg-block h2{font:700 14px Cinzel,serif;letter-spacing:.3em;color:#6ab4ff;margin:0 0 18px}' +
    '#dg-block p{font:italic 19px/1.6 "Crimson Pro",Georgia,serif;color:#c8d8ee;margin:0}';
  document.head.appendChild(css);

  var font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Crimson+Pro:ital@1&display=swap';
  document.head.appendChild(font);

  // 2) Setelah body ada: buang semua isi asli, pasang layar blokir, matikan audio
  function block() {
    var b = document.body;
    if (!b) return;
    Array.prototype.slice.call(b.children).forEach(function (el) { el.parentNode.removeChild(el); });
    var d = document.createElement('div');
    d.id = 'dg-block';
    d.innerHTML =
      '<div class="box"><h1>LOKI THE WOLF</h1><h2>DESKTOP ONLY</h2>' +
      '<p>This world is built for desktop. Please open this site on a PC or laptop to enter.</p></div>';
    b.appendChild(d);
    try { window.stop(); } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', block);
  else block();
})();
