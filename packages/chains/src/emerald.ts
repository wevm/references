import { Chain } from './types'

export const emerald = {
  id: 42262,
  name: 'Oasis Emerald',
  network: 'emerald',
  nativeCurrency: {
    decimals: 18,
    name: 'Oasis ROSE',
    symbol: 'ROSE',
  },
  rpcUrls: {
    default: {
      http: ['https://emerald.oasis.dev'],
      webSocket: ['wss://emerald.oasis.dev/ws'],
    },
    public: {
      http: ['https://emerald.oasis.dev'],
      webSocket: ['wss://emerald.oasis.dev/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.emerald.oasis.dev',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1481392,
    },
  },
} as const satisfies Chain
