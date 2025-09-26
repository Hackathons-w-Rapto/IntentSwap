import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { mainnet, arbitrum } from "@reown/appkit/networks";

// Custom networks
const somniaTestnet = {
  id: 50312,
  name: "Somnia Testnet",
  network: "somnia-testnet",
  nativeCurrency: {
    name: "Somnia Test Token",
    symbol: "STT",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://dream-rpc.somnia.network/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Somnia Explorer",
      url: "https://shannon-explorer.somnia.network/",
    },
    alternative: {
      name: "SocialScan",
      url: "https://somnia-testnet.socialscan.io/",
    },
  },
  testnet: true,
};

const anvil = {
  id: 31337,
  name: "Anvil Local",
  network: "anvil",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
  },
  blockExplorers: {
    default: { name: "Anvil Explorer", url: "" },
  },
  testnet: true,
};

// Custom RPC URLs for AppKit
export const customRpcUrls = {
  "eip155:50312": [{ http: "https://dream-rpc.somnia.network/" }],
  "eip155:31337": [{ http: "http://127.0.0.1:8545" }],
};

// Get projectId from https://dashboard.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mainnet, arbitrum, somniaTestnet, anvil];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  customRpcUrls,
});

export const config = wagmiAdapter.wagmiConfig;
