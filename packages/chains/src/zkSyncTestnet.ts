import { Chain } from './types'

export const zkSyncTestnet = {
  id: 280,
  name: 'zkSync Testnet',
  network: 'zksync-testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://zksync2-testnet.zksync.dev'],
      webSocket: ['wss://zksync2-testnet.zksync.dev/ws'],
    },
    public: {
      http: ['https://zksync2-testnet.zksync.dev'],
      webSocket: ['wss://zksync2-testnet.zksync.dev/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'zkExplorer',
      url: 'https://goerli.explorer.zksync.io',
    },
  },
  testnet: true,
} as const satisfies Chain
