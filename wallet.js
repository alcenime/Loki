/* Loki The Wolf — wallet.js
 * Wallet connect via Reown AppKit (ethers adapter), Robinhood Chain mainnet.
 * Allowlist domain situs (lokithewolf.xyz) di cloud.reown.com sebelum dipakai.
 * Dipakai di semua halaman yang butuh wallet (BUKAN index/loading/docs):
 * <script type="module" src="wallet.js"></script>
 * Pasang SEBELUM topbar.js dan nft.js.
 */

const PROJECT_ID = '2ee5bb382849649365d9a79c10cbddb3';

import { createAppKit } from 'https://esm.sh/@reown/appkit';
import { EthersAdapter } from 'https://esm.sh/@reown/appkit-adapter-ethers';
import { defineChain } from 'https://esm.sh/@reown/appkit/networks';

const robinhood = defineChain({
  id: 4663,
  caipNetworkId: 'eip155:4663',
  chainNamespace: 'eip155',
  name: 'Robinhood Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.mainnet.chain.robinhood.com'] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://robinhoodchain.blockscout.com' } }
});

// Tombol wallet di Loki: topbar.js (.tb-wallet-btn), info.html (.connect-wallet-btn), dan .wallet (lama)
const BTN_SELECTOR = '.tb-wallet-btn, .connect-wallet-btn, .wallet';
const LABEL_SELECTOR = '.tb-wallet-label, .wallet-label';
const DEFAULT_LABEL = 'Connect Wallet';

let appkit = null;
try {
  if (!PROJECT_ID || PROJECT_ID.startsWith('YOUR_')) throw new Error('PROJECT_ID belum diisi di wallet.js');
  appkit = createAppKit({
    adapters: [new EthersAdapter()],
    networks: [robinhood],
    defaultNetwork: robinhood,
    projectId: PROJECT_ID,
    metadata: {
      name: 'Loki The Wolf',
      description: 'Loki The Wolf — fantasy NFT collection',
      url: window.location.origin,
      icons: []
    },
    features: { analytics: false, email: false, socials: false, onramp: false, swaps: false },
    themeMode: 'dark',
    themeVariables: {
      '--w3m-accent': '#e8c96a',
      '--w3m-color-mix': '#0a1628',
      '--w3m-color-mix-strength': 25,
      '--w3m-border-radius-master': '2px'
    }
  });
} catch (err) {
  console.error('[wallet.js]', err);
}

const short = (a) => a.slice(0, 6) + '…' + a.slice(-4);

let lastLabel = DEFAULT_LABEL;

function setLabel(text) {
  lastLabel = text;
  document.querySelectorAll(LABEL_SELECTOR).forEach((l) => {
    if (l.textContent !== text) l.textContent = text;
  });
  // Tombol lama tanpa span label
  document.querySelectorAll(BTN_SELECTOR).forEach((b) => {
    if (!b.querySelector(LABEL_SELECTOR) && b.textContent !== text) b.textContent = text;
  });
}

function openWallet() {
  if (!appkit) { alert('Wallet belum dikonfigurasi (Project ID belum diisi).'); return; }
  // Belum konek -> modal pilih wallet. Sudah konek -> modal akun (ada Disconnect).
  appkit.open();
}

// Dipanggil juga oleh topbar.js lewat lokiConnectWallet()
window.connectWallet = openWallet;

// Delegasi klik (capture) supaya tombol yang dirender belakangan (topbar.js) ikut jalan,
// dan handler inline lama (popup "coming soon") tidak ikut kepicu.
document.addEventListener('click', (e) => {
  const btn = e.target.closest && e.target.closest(BTN_SELECTOR);
  if (!btn) return;
  e.preventDefault();
  e.stopPropagation();
  openWallet();
}, true);

// Topbar dirender ulang oleh loadTopbar() -> terapkan label terakhir lagi
new MutationObserver(() => {
  if (lastLabel !== DEFAULT_LABEL) setLabel(lastLabel);
}).observe(document.body, { childList: true, subtree: true });

if (appkit) {
  appkit.subscribeAccount((acc) => {
    if (acc && acc.isConnected && acc.address) {
      setLabel(short(acc.address));
      window.lokiWallet = { address: acc.address, appkit };
    } else {
      setLabel(DEFAULT_LABEL);
      window.lokiWallet = { address: null, appkit };
    }
    document.dispatchEvent(new CustomEvent('lokiwallet:change', { detail: { address: (acc && acc.address) || null } }));
  });
}
