import EthereumProvider from "@walletconnect/ethereum-provider";
import { Web3Modal } from "@web3modal/standalone";

const projectId = "962425907914a3e80a7d8e7288b23f62";

let provider;
let modal;

async function init() {
  provider = await EthereumProvider.init({
    projectId,
    chains: [1],
    showQrModal: false
  });

  modal = new Web3Modal({
    projectId,
    standaloneChains: ["eip155:1"],
    themeMode: "dark"
  });

  // THIS IS WHAT OPENS THE MODAL
  provider.on("display_uri", (uri) => {
    modal.openModal({ uri });
  });

  provider.on("connect", async () => {
    const accounts = await provider.request({
      method: "eth_accounts"
    });

    document.getElementById("status").textContent =
      "Wallet connected successfully";

    document.getElementById("address").textContent =
      accounts[0];

    modal.closeModal();
  });
}

document.getElementById("connectBtn").addEventListener("click", async () => {
  await provider.connect();
});

await init();
