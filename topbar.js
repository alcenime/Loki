(function () {
  // ─── CSS ───
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');

    .topbar {
      height: 64px; flex-shrink: 0;
      background: linear-gradient(180deg, rgba(5,12,30,0.95), rgba(10,22,50,0.85));
      border-bottom: none;
      display: flex; align-items: center;
      padding: 0 12px; gap: 8px;
      backdrop-filter: blur(6px);
    }
    .tb-spacer { flex: 1; }
    .tb-currency-group { display: flex; align-items: center; gap: 6px; }
    .tb-currency-pill {
      display: flex; align-items: center; gap: 6px;
      background: rgba(5,12,30,0.75);
      border: 1px solid rgba(232,201,106,0.28);
      border-radius: 20px;
      padding: 6px 10px;
      font-size: 14px; font-weight: 600;
      color: #f0f4ff;
      min-width: 80px;
    }
    .tb-currency-pill .tb-plus {
      width: 20px; height: 20px; border-radius: 50%;
      background: #e8c96a; color: #050b1c;
      font-size: 13px; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0; margin-left: auto;
    }
    .tb-energy-pill {
      display: flex; align-items: center; gap: 6px;
      background: rgba(5,12,30,0.75);
      border: 1px solid rgba(106,180,255,0.3);
      border-radius: 20px;
      padding: 6px 10px;
      font-size: 14px; font-weight: 600;
      color: #f0f4ff;
      min-width: 90px;
    }
    .tb-energy-pill .tb-plus {
      width: 20px; height: 20px; border-radius: 50%;
      background: rgba(160,96,255,0.85); color: white;
      font-size: 13px; font-weight: 900;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; flex-shrink: 0; margin-left: auto;
    }
    .tb-wallet-btn {
      display: flex; align-items: center; gap: 7px;
      padding: 8px 14px;
      background: linear-gradient(135deg, rgba(18,36,80,0.95), rgba(26,52,110,0.9));
      border: 1px solid rgba(232,201,106,0.45);
      border-radius: 20px; cursor: pointer;
      font-family: 'Cinzel', serif;
      font-size: 10px; font-weight: 700;
      color: #f5dfa0; letter-spacing: 0.4px;
      white-space: nowrap;
    }
  `;

  function injectCSS() {
    if (document.getElementById('topbar-styles')) return;
    const style = document.createElement('style');
    style.id = 'topbar-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ─── BUILD HTML ───
  // options: { showWallet: true/false }
  function buildTopbar(options) {
    const showWallet = options && options.showWallet === false ? false : true;
    const walletHTML = showWallet ? `
      <div class="tb-wallet-btn" onclick="document.getElementById('coming-soon-popup') && (document.getElementById('coming-soon-popup').style.display='flex')">
        <span>⬡</span><span>Connect Wallet</span>
      </div>` : '';

    return `
    <div class="topbar">
      <div class="tb-spacer"></div>
      <div class="tb-currency-group">
        <div class="tb-currency-pill">
          <img src="assets/buy/wolfgold.png" style="width:18px;height:18px;object-fit:contain;flex-shrink:0;"/>
          <span>0</span>
          <div class="tb-plus">+</div>
        </div>
        <div class="tb-currency-pill">
          <img src="assets/buy/wolfcoin.png" style="width:18px;height:18px;object-fit:contain;flex-shrink:0;"/>
          <span>0</span>
          <div class="tb-plus">+</div>
        </div>
        <div class="tb-energy-pill">
          <img src="assets/dashboard/icons/energy.png" style="width:18px;height:18px;object-fit:contain;flex-shrink:0;"/>
          <span>0/100</span>
          <div class="tb-plus">+</div>
        </div>
      </div>
      <div class="tb-spacer"></div>
      ${walletHTML}
    </div>`;
  }

  // ─── INJECT ───
  window.loadTopbar = function (options) {
    injectCSS();
    const existing = document.querySelector('.topbar');
    const temp = document.createElement('div');
    temp.innerHTML = buildTopbar(options);
    const newTopbar = temp.firstElementChild;

    if (existing) {
      existing.replaceWith(newTopbar);
    } else {
      const centerCol = document.querySelector('.center-col');
      if (centerCol) centerCol.prepend(newTopbar);
    }
  };
})();
