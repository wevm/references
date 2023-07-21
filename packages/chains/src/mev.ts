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
  contracts: {},
} as const satisfies Chain
