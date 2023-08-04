import { Chain } from './types'

export const zkSync = {
  id: 324,
  name: 'zkSync Era',
  network: 'zksync-era',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.era.zksync.io'],
      webSocket: ['wss://mainnet.era.zksync.io/ws'],
    },
    public: {
      http: ['https://mainnet.era.zksync.io'],
      webSocket: ['wss://mainnet.era.zksync.io/ws'],
    },
  },
  websiteUrl: 'https://zksync.io/',
  blockExplorers: {
    default: {
      name: 'zkExplorer',
      url: 'https://explorer.zksync.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
    },
  },
} as const satisfies Chain
