import { Chain } from './types'

export const zkSync = {
  id: 324,
  name: 'zkSync',
  network: 'zksync',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://zksync2-mainnet.zksync.io'],
      webSocket: ['wss://zksync2-mainnet.zksync.io/ws'],
    },
    public: {
      http: ['https://zksync2-mainnet.zksync.io'],
      webSocket: ['wss://zksync2-mainnet.zksync.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'zkExplorer',
      url: 'https://explorer.zksync.io',
    },
  },
} as const satisfies Chain
