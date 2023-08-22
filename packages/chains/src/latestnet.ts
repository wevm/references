import { Chain } from './types'

export const latestnet = {
  id: 418,
  name: 'LaTestnet',
  network: 'latestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'LaTestnet',
    symbol: 'TLA',
  },
  rpcUrls: {
    public: {
      http: ['https://rpc.testnet.lachain.network'],
    },
    default: {
      http: ['https://rpc.testnet.lachain.network'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'LaTestnet Explorer',
      url: 'https://testexplorer.lachain.network',
    },
    default: {
      name: 'LaTestnet Explorer',
      url: 'https://testexplorer.lachain.network',
    },
  },
} as const satisfies Chain
