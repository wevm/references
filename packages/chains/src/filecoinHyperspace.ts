import { Chain } from './types'

export const filecoin: Chain = {
  id: 3141,
  name: "Filecoin Hyperspace",
  network: "filecoin-hyperspace",
  nativeCurrency: {
    decimals: 18,
    name: "Test FIL",
    symbol: "TFIL",
  },
  rpcUrls: {
    default: { http: ["https://api.hyperspace.node.glif.io/rpc/v1"] },
    public: { http: ["https://api.hyperspace.node.glif.io/rpc/v1"] },
  },
  blockExplorers: {
    gilf: {
      name: "Gilf",
      url: "https://explorer.glif.io/?network=hyperspace",
    },
    default: {
      name: "FilFox",
      url: "https://hyperspace.filfox.info/en",
    },
  },
};
