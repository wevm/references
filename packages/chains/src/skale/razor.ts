import { Chain } from '../types'

export const skaleRazor = {
  id: 278_611_351,
  name: 'SKALE | Razor Network',
  network: 'skale-razor',
  nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.skalenodes.com/v1/turbulent-unique-scheat'],
      webSocket: ['wss://mainnet.skalenodes.com/v1/ws/turbulent-unique-scheat'],
    },
    public: {
      http: ['https://mainnet.skalenodes.com/v1/turbulent-unique-scheat'],
      webSocket: ['wss://mainnet.skalenodes.com/v1/ws/turbulent-unique-scheat'],
    },
  },
  websiteUrl: 'https://razor.network/',
  blockExplorers: {
    blockscout: {
      name: 'SKALE Explorer',
      url: 'https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com',
    },
    default: {
      name: 'SKALE Explorer',
      url: 'https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com',
    },
  },
  contracts: {},
} as const satisfies Chain
