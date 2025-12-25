import EthereumProvider from "@walletconnect/ethereum-provider";
import { Web3Modal } from "@web3modal/standalone";

const projectId = "962425907914a3e80a7d8e7288b23f62";

let provider;
let modal;
let isInitialized = false;

async function init() {
  provider = await EthereumProvider.init({
    projectId,
    chains: [1],
    showQrModal: false
  });

  modal = new Web3Modal({
    projectId,
    standaloneChains: ["eip155:1"],
    themeMode: "dark",
    themeVariables: {
      "--w3m-accent-color": "#6366f1",
      "--w3m-background-color": "#020617",
      "--w3m-border-radius-master": "14px"
    }
  });

  provider.on("display_uri", (uri) => {
    modal.openModal({ uri });
  });

  provider.on("connect", async () => {
    const accounts = await provider.request({
      method: "eth_accounts"
    });

    document.getElementById("status").textContent =
      "✓ Wallet connected successfully";

    document.getElementById("address").textContent =
      "Connected Address:\n" + accounts[0];

    modal.closeModal();
  });

  isInitialized = true;
}

await init();

document.getElementById("connectBtn").addEventListener("click", async () => {
  if (!isInitialized) return;

  // 🔐 SAFETY: ensure modal always opens
  modal.openModal();

  try {
    await provider.connect();
  } catch (err) {
    console.error("Connection failed:", err);
    modal.closeModal();
  }
});
