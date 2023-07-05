import { Chain } from './types'

export const mev = {
  id: 7518,
  network: 'MEVerse',
  name: 'MEVerse Chain Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MEVerse',
    symbol: 'MEV',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.meversemainnet.io'],
    },
    public: {
      http: ['https://rpc.meversemainnet.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://www.meversescan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0x72E21D74347899EACDeDa7aCdc01d9514eeC80c9',
      blockCreated: 86585075,
    },
  },
} as const satisfies Chain
