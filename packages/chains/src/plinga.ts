import { Chain } from "./types";

export const plinga = {
  id: 242,
  name: "Plinga AI Chain",
  network: "plinga",
  nativeCurrency: {
    decimals: 18,
    name: "Plinga",
    symbol: "PLINGA",
  },
  rpcUrls: {
    default: { http: ["https://rpcurl.mainnet.plgchain.com"] },
    public: { http: ["https://rpcurl.mainnet.plgchain.com"] },
  },
  blockExplorers: {
    etherscan: { name: "PlgScan", url: "https://www.plgscan.com" },
    default: { name: "PlgScan", url: "https://www.plgscan.com" },
  },
  contracts: {
    multicall3: {
      address: "0x0989576160f2e7092908BB9479631b901060b6e4",
      blockCreated: 204489,
    },
  },
} as const satisfies Chain;
