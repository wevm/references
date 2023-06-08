import { Chain } from './types'

export const scrollTestnet = {
  id: 534_353,
  name: 'Scroll Testnet',
  network: 'scroll-testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://alpha-rpc.scroll.io/l2'],
      webSocket: ['wss://alpha-rpc.scroll.io/l2/ws'],
    },
    public: {
      http: ['https://alpha-rpc.scroll.io/l2'],
      webSocket: ['wss://alpha-rpc.scroll.io/l2/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://blockscout.scroll.io',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 2745641,
    },
  },
} as const satisfies Chain
