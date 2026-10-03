/* Loki The Wolf — nft.js
 * Deteksi NFT Wolf Sigil (maks 100) milik wallet yang connect, tampil di tab Cards (profile.html).
 * Pasang di profile.html. Alamat wallet dibaca dari wallet.js (window.lokiWallet + event 'lokiwallet:change'):
 *   <script src="nft.js"></script>
 * Jalur data: 1) Blockscout API (cepat, ada gambar)  2) fallback RPC langsung.
 */
(function () {
  'use strict';

  var CFG = {
    chainId: 4663,
    chainHex: '0x1237',
    rpc: 'https://rpc.mainnet.chain.robinhood.com',
    api: 'https://robinhoodchain.blockscout.com/api/v2',
    contract: '0x09a26fC8FCEF18192E267D7A6da9dFb4be81Dd6A'.toLowerCase(),
    maxShow: 100,
    supply: 5555,
    perPage: 6,
    ipfs: 'https://ipfs.io/ipfs/'
  };

  var state = { address: null, items: [], page: 1, loading: false, rarity: 'all', selected: null };
  var $ = function (id) { return document.getElementById(id); };

  /* ───────── util ───────── */
  function fixUri(u) {
    if (!u) return '';
    if (u.indexOf('ipfs://') === 0) return CFG.ipfs + u.slice(7).replace(/^ipfs\//, '');
    return u;
  }
  function pad(hex, n) { return ('0'.repeat(n) + hex).slice(-n); }
  function enc(addr) { return pad(addr.toLowerCase().replace('0x', ''), 64); }
  function encInt(n) { return pad(BigInt(n).toString(16), 64); }

  function rpcBatch(calls) {
    var body = calls.map(function (c, i) {
      return { jsonrpc: '2.0', id: i, method: 'eth_call', params: [{ to: CFG.contract, data: c }, 'latest'] };
    });
    return fetch(CFG.rpc, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (arr) {
        var out = new Array(calls.length);
        (Array.isArray(arr) ? arr : [arr]).forEach(function (x) { out[x.id] = x.error ? null : x.result; });
        return out;
      });
  }
  function rpcOne(data) { return rpcBatch([data]).then(function (r) { return r[0]; }); }

  function decodeString(hex) {
    if (!hex || hex.length < 130) return '';
    var h = hex.slice(2);
    var off = parseInt(h.slice(0, 64), 16) * 2;
    var len = parseInt(h.slice(off, off + 64), 16) * 2;
    var s = h.slice(off + 64, off + 64 + len), out = '';
    for (var i = 0; i < s.length; i += 2) out += String.fromCharCode(parseInt(s.substr(i, 2), 16));
    try { return decodeURIComponent(escape(out)); } catch (e) { return out; }
  }

  function rarityOf(attrs) {
    if (!Array.isArray(attrs)) return '';
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i] && /rarit/i.test(attrs[i].trait_type || '')) return String(attrs[i].value || '').toLowerCase();
    }
    return '';
  }

  /* ───────── jalur 1: Blockscout ───────── */
  function fetchBlockscout(owner) {
    var found = [];
    function page(params) {
      var q = 'type=ERC-721' + (params ? '&' + params : '');
      return fetch(CFG.api + '/addresses/' + owner + '/nft?' + q)
        .then(function (r) { if (!r.ok) throw new Error('blockscout ' + r.status); return r.json(); })
        .then(function (j) {
          (j.items || []).forEach(function (it) {
            var addr = ((it.token && (it.token.address_hash || it.token.address)) || '').toLowerCase();
            if (addr === CFG.contract) {
              var md = it.metadata || {};
              found.push({
                id: it.id,
                name: md.name || ('Wolf Sigil #' + it.id),
                image: fixUri(it.image_url || md.image || ''),
                rarity: rarityOf(md.attributes),
                attrs: Array.isArray(md.attributes) ? md.attributes : []
              });
            }
          });
          var np = j.next_page_params;
          if (np && found.length < CFG.maxShow) {
            var p = Object.keys(np).map(function (k) { return k + '=' + encodeURIComponent(np[k]); }).join('&');
            return page(p);
          }
        });
    }
    return page('').then(function () { return found; });
  }

  /* ───────── jalur 2: RPC langsung ───────── */
  function fetchRpc(owner) {
    return rpcOne('0x70a08231' + enc(owner)).then(function (balHex) {
      var bal = parseInt(balHex || '0x0', 16);
      if (!bal) return [];
      var want = Math.min(bal, CFG.maxShow);
      // coba ERC721Enumerable dulu
      var calls = [];
      for (var i = 0; i < want; i++) calls.push('0x2f745c59' + enc(owner) + encInt(i));
      return rpcBatch(calls).then(function (res) {
        if (res.every(function (x) { return x && x !== '0x'; })) {
          return res.map(function (x) { return parseInt(x, 16); });
        }
        return scanOwnerOf(owner, want);
      });
    }).then(function (ids) { return ids.map(function (id) { return { id: String(id), name: 'Wolf Sigil #' + id, image: '', rarity: '' }; }); })
      .then(loadMetaViaUri);
  }

  function scanOwnerOf(owner, want) {
    var ids = [], start = 0, STEP = 300, me = owner.toLowerCase().replace('0x', '');
    function next() {
      if (ids.length >= want || start > CFG.supply + 1) return Promise.resolve(ids);
      var calls = [], base = start;
      for (var i = 0; i < STEP; i++) calls.push('0x6352211e' + encInt(base + i));
      start += STEP;
      return rpcBatch(calls).then(function (res) {
        res.forEach(function (x, i) {
          if (x && x.length >= 66 && x.slice(-40).toLowerCase() === me && ids.length < want) ids.push(base + i);
        });
        return next();
      });
    }
    return next();
  }

  function loadMetaViaUri(items) {
    return Promise.all(items.map(function (it) {
      return rpcOne('0xc87b56dd' + encInt(it.id)).then(function (hex) {
        var uri = fixUri(decodeString(hex));
        if (!uri) return it;
        return fetch(uri).then(function (r) { return r.json(); }).then(function (md) {
          it.name = md.name || it.name;
          it.image = fixUri(md.image || '');
          it.rarity = rarityOf(md.attributes);
          it.attrs = Array.isArray(md.attributes) ? md.attributes : [];
          return it;
        }).catch(function () { return it; });
      }).catch(function () { return it; });
    }));
  }

  /* ───────── render ───────── */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function msgSlot(text) {
    return '<div style="grid-column:1/-1;grid-row:1/-1;display:flex;align-items:center;justify-content:center;text-align:center;padding:12px;' +
      'font-family:Cinzel,serif;font-size:11px;letter-spacing:.5px;color:rgba(200,216,238,.6);line-height:1.6;">' + text + '</div>';
  }

  function visible() {
    if (state.rarity === 'all') return state.items;
    return state.items.filter(function (x) { return x.rarity === state.rarity; });
  }

  function render() {
    var grid = $('cardsGrid');
    if (!grid) return;
    var list = visible();
    var pages = Math.max(1, Math.ceil(list.length / CFG.perPage));
    if (state.page > pages) state.page = pages;

    if (state.loading) {
      grid.innerHTML = msgSlot('Scanning wallet for Wolf Sigil…');
    } else if (!state.address) {
      grid.innerHTML = msgSlot('Connect your wallet<br>to see your Wolf Sigil cards.');
    } else if (!list.length) {
      grid.innerHTML = msgSlot("You don't own any<br>Wolf Sigil NFT.");
    } else {
      var from = (state.page - 1) * CFG.perPage;
      grid.innerHTML = list.slice(from, from + CFG.perPage).map(function (it) {
        var img = it.image
          ? '<img src="' + esc(it.image) + '" loading="lazy" alt="' + esc(it.name) + '" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:7px;" onerror="this.style.opacity=.15"/>'
          : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:22px;opacity:.3;">◆</div>';
        return '<div class="card-slot" title="' + esc(it.name) + '">' + img +
          '<div style="position:absolute;left:0;right:0;bottom:0;padding:10px 6px 4px;text-align:center;' +
          'font-family:Cinzel,serif;font-size:9px;font-weight:700;letter-spacing:.5px;color:#e8c96a;' +
          'background:linear-gradient(transparent,rgba(5,11,28,.92));">#' + esc(it.id) + '</div></div>';
      }).join('');
    }

    var ind = document.querySelector('#tab-cards .page-indicator');
    if (ind) ind.textContent = state.page + ' / ' + pages;

    var cnt = document.querySelector('#tab-cards .cards-overview-count');
    if (cnt) cnt.textContent = state.items.length + ' / ' + CFG.supply.toLocaleString('en-US');

    var rows = document.querySelectorAll('#tab-cards .ov-rarity-row');
    for (var i = 0; i < rows.length; i++) {
      var name = rows[i].querySelector('.ov-rarity-name').textContent.trim().toLowerCase();
      var n = state.items.filter(function (x) { return x.rarity === name; }).length;
      rows[i].querySelector('.ov-rarity-val').textContent = n;
    }
    renderInv();
  }


  /* ───────── Inventory tab (Wolf Sigil) ───────── */
  var GOLD = 'rgba(232,201,106,';
  function invMsg(t) {
    return '<div style="height:100%;min-height:140px;display:flex;align-items:center;justify-content:center;text-align:center;padding:12px;' +
      'font-family:Cinzel,serif;font-size:11px;letter-spacing:.5px;color:rgba(200,216,238,.6);line-height:1.7;">' + t + '</div>';
  }

  function renderInv() {
    var body = $('invBody'), cnt = $('invCount');
    if (!body) return;
    var ready = state.address && !state.loading;
    if (cnt) cnt.textContent = ready ? '· ' + state.items.length : '';
    var cap = $('invCap'), bar = $('invCapBar'), have = ready ? state.items.length : 0;
    if (cap) cap.textContent = have + ' / ' + CFG.maxShow;
    if (bar) bar.style.width = Math.min(100, have / CFG.maxShow * 100) + '%';

    if (state.loading) body.innerHTML = invMsg('Scanning wallet…');
    else if (!state.address) body.innerHTML = invMsg('Connect your wallet<br>to see your items.');
    else if (!state.items.length) body.innerHTML = invMsg("You don't own any items.");
    else {
      body.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:6px;">' +
        state.items.map(function (it) {
          var img = it.image
            ? '<img src="' + esc(it.image) + '" loading="lazy" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" onerror="this.style.opacity=.15"/>'
            : '<span style="font-size:18px;opacity:.3;">◆</span>';
          return '<div class="inv-slot" data-id="' + esc(it.id) + '" title="' + esc(it.name) + '" style="' +
            '' + '">' + img +
            '<div style="position:absolute;left:0;right:0;bottom:0;padding:8px 2px 2px;text-align:center;font-family:Cinzel,serif;font-size:8px;font-weight:700;color:#e8c96a;' +
            'background:linear-gradient(transparent,rgba(5,11,28,.9));">#' + esc(it.id) + '</div></div>';
        }).join('') + '</div>';
    }
  }

  /* ───────── load ───────── */
  function load(addr) {
    if (!addr || !/^0x[0-9a-fA-F]{40}$/.test(addr)) { state.address = null; state.items = []; render(); return Promise.resolve(); }
    if (state.address === addr.toLowerCase() && !state.loading && state.items.length) return Promise.resolve();
    state.address = addr.toLowerCase();
    state.loading = true; state.page = 1; render();
    return fetchBlockscout(state.address)
      .catch(function () { return fetchRpc(state.address); })
      .then(function (items) { state.items = items.slice(0, CFG.maxShow); })
      .catch(function (e) { console.warn('[nft.js]', e); state.items = []; })
      .then(function () { state.loading = false; render(); });
  }

  /* ───────── deteksi wallet yang connect (wallet.js -> window.lokiWallet) ───────── */
  function currentAddress() {
    var w = window.lokiWallet;
    return (w && typeof w.address === 'string') ? w.address : null;
  }

  function bind() {
    var prev = document.querySelector('#tab-cards .cards-pagination .page-btn:first-child');
    var next = document.querySelector('#tab-cards .cards-pagination .page-btn:last-child');
    if (prev) prev.addEventListener('click', function () { if (state.page > 1) { state.page--; render(); } });
    if (next) next.addEventListener('click', function () {
      var pages = Math.max(1, Math.ceil(visible().length / CFG.perPage));
      if (state.page < pages) { state.page++; render(); }
    });

    // wallet.js mengirim event ini setiap connect / disconnect / ganti akun
    document.addEventListener('lokiwallet:change', function (e) {
      load(e && e.detail && e.detail.address);
    });

    // wallet.js dimuat sebagai module (lebih lambat) -> cek sebentar kalau event sudah lewat
    var tries = 0, t = setInterval(function () {
      var a = currentAddress();
      if (a && a.toLowerCase() !== state.address) load(a);
      if (a || ++tries > 20) clearInterval(t);
    }, 500);

    var a0 = currentAddress();
    if (a0) load(a0);
    render();
  }

  // filter rarity dari panel kiri (kalau ada)
  window.filterRarity = function () {
    var boxes = document.querySelectorAll('#tab-cards .rarity-check-row');
    var pick = 'all';
    for (var i = 1; i < boxes.length; i++) {
      var cb = boxes[i].querySelector('input');
      if (cb && cb.checked) { pick = boxes[i].querySelector('.rarity-label').textContent.trim().toLowerCase(); break; }
    }
    state.rarity = pick; state.page = 1; render();
  };

  window.LokiNFT = { load: load, state: state, config: CFG, refresh: function () { var a = currentAddress(); state.address = null; return load(a); } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
