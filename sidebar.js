(function () {
  // ─── CSS VARIABLES & SIDEBAR STYLES ───
  const CSS = `
    :root {
      --gold: #e8c96a;
      --gold-light: #f5dfa0;
      --gold-dark: #b8962a;
      --blue-deep: #050b1c;
      --red-alert: #e04040;
    }
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&display=swap');

    .sidebar {
      width: 178px;
      background: linear-gradient(180deg,
        rgba(5,11,28,0.99) 0%,
        rgba(8,16,38,0.98) 40%,
        rgba(6,13,32,0.99) 100%
      );
      border-right: 1px solid rgba(232,201,106,0.22);
      flex-shrink: 0;
      display: flex; flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .sidebar::before {
      content: '';
      position: absolute; top: 0; right: 0;
      width: 1px; height: 100%;
      background: linear-gradient(180deg,
        transparent 0%,
        rgba(232,201,106,0.6) 20%,
        rgba(232,201,106,0.6) 80%,
        transparent 100%
      );
      box-shadow: 0 0 8px rgba(232,201,106,0.15);
      z-index: 10;
    }
    .sidebar::after {
      content: '';
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      background: radial-gradient(ellipse 60% 30% at 50% 50%, rgba(74,144,217,0.04) 0%, transparent 70%);
      pointer-events: none;
    }
    .sidebar-brand {
      display: flex; align-items: center; gap: 10px;
      padding: 14px 14px 12px;
      border-bottom: 1px solid rgba(232,201,106,0.2);
      flex-shrink: 0;
    }
    .sidebar-brand-logo {
      width: 38px; height: 38px;
      object-fit: contain;
      border-radius: 50%;
      border: 1.5px solid rgba(232,201,106,0.65);
      box-shadow: 0 0 10px rgba(232,201,106,0.25);
      flex-shrink: 0;
    }
    .sidebar-brand-name {
      font-family: 'Cinzel', serif;
      font-size: 13px; font-weight: 700;
      color: #f5dfa0;
      letter-spacing: 1px;
      text-shadow: 0 0 10px rgba(232,201,106,0.4);
      line-height: 1.2;
    }
    .sidebar-brand-sub {
      font-family: 'Cinzel', serif;
      font-size: 9px; font-weight: 400;
      color: rgba(200,216,238,0.5);
      letter-spacing: 0.5px;
      margin-top: 1px;
    }
    .sidebar-nav {
      flex: 1;
      padding: 6px 0 4px;
      display: flex; flex-direction: column; gap: 0;
    }
    .nav-divider {
      display: flex; align-items: center;
      padding: 8px 12px 6px;
      gap: 6px;
      flex-shrink: 0;
    }
    .nav-divider::before,
    .nav-divider::after {
      content: '';
      flex: 1; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(232,201,106,0.28), transparent);
    }
    .nav-divider-gem {
      width: 5px; height: 5px;
      background: rgba(232,201,106,0.6);
      transform: rotate(45deg);
      flex-shrink: 0;
      box-shadow: 0 0 6px rgba(232,201,106,0.4);
    }
    .nav-item {
      display: flex; align-items: center; gap: 9px;
      padding: 7px 10px 7px 14px;
      cursor: pointer;
      position: relative;
      transition: all 0.18s ease;
      margin: 1px 6px 1px 0;
      border-radius: 0 6px 6px 0;
      border: 1px solid transparent;
      border-left: none;
      background: transparent;
    }
    .nav-item:hover {
      background: rgba(232,201,106,0.06);
      border-color: rgba(232,201,106,0.1);
      border-left: none;
    }
    .nav-item.active {
      background: linear-gradient(90deg, rgba(74,144,217,0.14) 0%, rgba(74,144,217,0.06) 100%);
      border-color: rgba(232,201,106,0.18);
      border-left: none;
      box-shadow: inset 0 0 12px rgba(74,144,217,0.08);
    }
    .nav-item.active::before {
      content: '';
      position: absolute; left: 0; top: 50%;
      transform: translateY(-50%);
      width: 2.5px; height: 55%;
      background: linear-gradient(180deg, rgba(232,201,106,0.4), var(--gold), rgba(232,201,106,0.4));
      border-radius: 0 2px 2px 0;
      box-shadow: 0 0 8px rgba(232,201,106,0.7), 0 0 16px rgba(232,201,106,0.3);
    }
    .nav-icon {
      width: 24px; height: 24px;
      border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      background: transparent;
      flex-shrink: 0;
      overflow: hidden;
      transition: all 0.18s;
    }
    .nav-icon img {
      width: 18px; height: 18px;
      object-fit: contain;
      filter: brightness(0.55) saturate(0.6);
      transition: filter 0.18s;
    }
    .nav-item:hover .nav-icon img {
      filter: brightness(0.8) saturate(0.8);
    }
    .nav-item.active .nav-icon {
      background: rgba(232,201,106,0.1);
    }
    .nav-item.active .nav-icon img {
      filter: brightness(1) saturate(1.2) drop-shadow(0 0 5px rgba(232,201,106,0.7));
    }
    .nav-label {
      font-family: 'Cinzel', serif;
      font-size: 10.5px; font-weight: 600;
      color: rgba(200,216,238,0.45);
      letter-spacing: 0.5px;
      transition: color 0.18s;
    }
    .nav-item:hover .nav-label {
      color: rgba(200,216,238,0.7);
    }
    .nav-item.active .nav-label {
      color: var(--gold-light);
      text-shadow: 0 0 12px rgba(232,201,106,0.4);
    }
    .nav-badge {
      margin-left: auto;
      width: 14px; height: 14px;
      border-radius: 50%;
      background: var(--red-alert);
      font-size: 8px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      color: white;
      box-shadow: 0 0 6px rgba(232,64,64,0.5);
    }
    .nav-item.locked .nav-label { color: rgba(180,200,220,0.25); }
    .nav-item.locked .nav-icon  { opacity: 0.3; }
    .sidebar-portrait {
      width: 100%;
      padding: 8px 10px 12px;
      position: relative;
      flex-shrink: 0;
    }
    .sidebar-portrait::before {
      content: '';
      position: absolute; top: 0; left: 14px; right: 14px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(232,201,106,0.25), transparent);
    }
    .wolf-medallion {
      width: 100px; height: 100px;
      margin: 0 auto;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .wolf-medallion::before {
      content: '';
      position: absolute; inset: -10px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(232,201,106,0.08) 0%, transparent 70%);
      pointer-events: none;
    }
    .wolf-medallion::after { display: none; }
  `;

  // ─── NAV ITEMS CONFIG ───
  const NAV_ITEMS = [
    { key: 'home',        icon: 'homes.png',       label: 'Home',        href: 'index.html' },
    { key: 'summon',      icon: 'summons.png',      label: 'Summon',      href: 'summon.html' },
    { key: 'quests',      icon: 'quests.png',       label: 'Quests',      href: 'quests.html' },
    { key: 'marketplace', icon: 'marketplace.png',  label: 'Marketplace', href: 'marketplace.html' },
    { divider: true },
    { key: 'buy',         icon: 'shops.png',        label: 'Buy',         href: 'buy.html' },
    { key: 'codex',       icon: 'codex.png',        label: 'Codex',       href: 'codex.html' },
    { key: 'info',        icon: 'info.png',         label: 'Info',        href: 'info.html' },
    { spacer: true },
    { divider: true },
    { key: 'profile',     icon: 'profile.png',      label: 'Profile',     href: 'profile.html' },
  ];

  // ─── BUILD SIDEBAR HTML ───
  function buildSidebar(activePage) {
    const iconBase = 'assets/dashboard/icons/';

    let navHTML = '';
    NAV_ITEMS.forEach(item => {
      if (item.divider) {
        navHTML += `<div class="nav-divider"><div class="nav-divider-gem"></div></div>`;
      } else if (item.spacer) {
        navHTML += `<div style="flex:1;"></div>`;
      } else {
        const isActive = item.key === activePage ? ' active' : '';
        navHTML += `
        <div class="nav-item${isActive}" onclick="window.location.href='${item.href}'">
          <div class="nav-icon"><img src="${iconBase}${item.icon}" alt="${item.label}"></div>
          <div class="nav-label">${item.label}</div>
        </div>`;
      }
    });

    return `
    <div class="sidebar">
      <div class="sidebar-brand">
        <img src="assets/dashboard/logoloki.png" alt="Loki" class="sidebar-brand-logo">
        <div class="sidebar-brand-text">
          <div class="sidebar-brand-name">Loki</div>
          <div class="sidebar-brand-sub">the Wolf</div>
        </div>
      </div>
      <div class="sidebar-nav">
        ${navHTML}
      </div>
    </div>`;
  }

  // ─── INJECT CSS ───
  function injectCSS() {
    if (document.getElementById('sidebar-styles')) return;
    const style = document.createElement('style');
    style.id = 'sidebar-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ─── LOAD SIDEBAR (dipanggil dari tiap halaman) ───
  window.loadSidebar = function (activePage) {
    injectCSS();

    // Cari elemen target: div.sidebar yang sudah ada, atau div.app / div.layout
    const existing = document.querySelector('.sidebar');
    const sidebarHTML = buildSidebar(activePage);
    const temp = document.createElement('div');
    temp.innerHTML = sidebarHTML;
    const newSidebar = temp.firstElementChild;

    if (existing) {
      existing.replaceWith(newSidebar);
    } else {
      // Fallback: prepend ke body
      document.body.prepend(newSidebar);
    }
  };
})();
