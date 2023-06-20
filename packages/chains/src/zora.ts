import { Chain } from './types'

export const zora = {
  id: 7777777,
  name: 'ZORA',
  network: 'zora',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.zora.co'],
      webSocket: ['wss://rpc.zora.co'],
    },
    public: {
      http: ['https://rpc.zora.co'],
      webSocket: ['wss://rpc.zora.co'],
    },
  },
  blockExplorers: {
    etherscan: { name: 'ZORA', url: 'https://explorer.zora.co' },
    default: { name: 'ZORA', url: 'https://explorer.zora.co' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5882,
    },
  },
} as const satisfies Chain
