import { Chain } from './types'

export const mevTestnet = {
  id: 4759,
  network: 'MEVerse Testnet',
  name: 'MEVerse Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MEVerse',
    symbol: 'MEV',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.meversetestnet.io'],
    },
    public: {
      http: ['https://rpc.meversetestnet.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://testnet.meversescan.io/',
    },
  },
  contracts: {
    multicall3: {
      address: '0xa54A2db58990c21155e665f1Fdd51691A1d5f7f3',
      blockCreated: 64074965,
    },
  },
  testnet: true,
} as const satisfies Chain
