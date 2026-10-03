/* Loki The Wolf — desktopguard.js
 * Situs ini khusus desktop/PC. Kalau dibuka dari HP/tablet, halaman diganti pesan "Desktop only".
 * Pasang paling atas di <head> (sebelum script lain):
 * <script src="desktopguard.js"></script>
 */
(function () {
  var ua = navigator.userAgent || '';
  var mobileUA = /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile|BlackBerry|webOS/i.test(ua);
  var ipadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;       // iPad mode "desktop"
  var touchOnly = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches; // HP mode "desktop site"
  if (!(mobileUA || ipadOS || touchOnly)) return;

  var html =
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>Loki The Wolf - Desktop Only</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Crimson+Pro:ital@1&display=swap" rel="stylesheet">' +
    '<style>' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    'html,body{height:100%;background:#050b1c;overflow:hidden}' +
    'body{display:flex;align-items:center;justify-content:center;padding:24px;' +
    'background:radial-gradient(ellipse at 50% 30%,#112240 0%,#050b1c 70%)}' +
    '.box{max-width:420px;text-align:center;padding:32px 24px;border:1px solid rgba(232,201,106,.4);border-radius:12px;' +
    'background:rgba(10,22,40,.85);box-shadow:0 0 40px rgba(106,180,255,.15)}' +
    'h1{font:900 26px/1.2 Cinzel,serif;letter-spacing:.14em;color:#e8c96a;margin-bottom:6px}' +
    'h2{font:700 14px Cinzel,serif;letter-spacing:.3em;color:#6ab4ff;margin-bottom:18px}' +
    'p{font:italic 19px/1.6 "Crimson Pro",Georgia,serif;color:#c8d8ee}' +
    '</style></head><body><div class="box">' +
    '<h1>LOKI THE WOLF</h1><h2>DESKTOP ONLY</h2>' +
    '<p>This world is built for desktop. Please open this site on a PC or laptop to enter.</p>' +
    '</div></body></html>';

  document.open();
  document.write(html);
  document.close();
})();
