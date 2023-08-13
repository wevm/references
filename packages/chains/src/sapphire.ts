import { Chain } from './types'

export const sapphire = {
  id: 23294,
  name: 'Oasis Sapphire',
  network: 'sapphire',
  nativeCurrency: {
    decimals: 18,
    name: 'Oasis ROSE',
    symbol: 'ROSE',
  },
  rpcUrls: {
    default: {
      http: ['https://sapphire.oasis.io'],
      webSocket: ['wss://sapphire.oasis.io/ws'],
    },
    public: {
      http: ['https://sapphire.oasis.io'],
      webSocket: ['wss://sapphire.oasis.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/mainnet/sapphire',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 734531,
    },
  },
} as const satisfies Chain
