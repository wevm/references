import { Chain } from './types'

export const zetachainAthens3 = {
  id: 7001,
  name: "ZetaChain Athens 3",
  network: "zetachain-athens-evm",
  nativeCurrency: {
    decimals: 18,
    name: "Zeta",
    symbol: "aZETA",
  },
  rpcUrls: {
    public: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
    default: {
      http: ["https://zetachain-athens-evm.blockpi.network/v1/rpc/public"],
    },
  },
  blockExplorers: {
    default: {
      name: "ZetaScan",
      url: "https://athens3.explorer.zetachain.com"
    }
  },
  testnet: true,
} as const satisfies Chain;
