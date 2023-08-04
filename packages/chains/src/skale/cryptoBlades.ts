import { Chain } from '../types'

export const skaleCryptoBlades = {
  id: 1_026_062_157,
  name: 'SKALE | CryptoBlades',
  network: 'skale-cryptoblades',
  nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux'],
      webSocket: [
        'wss://mainnet.skalenodes.com/v1/ws/affectionate-immediate-pollux',
      ],
    },
    public: {
      http: ['https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux'],
      webSocket: [
        'wss://mainnet.skalenodes.com/v1/ws/affectionate-immediate-pollux',
      ],
    },
  },
  websiteUrl: 'https://www.cryptoblades.io/',
  blockExplorers: {
    blockscout: {
      name: 'SKALE Explorer',
      url: 'https://affectionate-immediate-pollux.explorer.mainnet.skalenodes.com',
    },
    default: {
      name: 'SKALE Explorer',
      url: 'https://affectionate-immediate-pollux.explorer.mainnet.skalenodes.com',
    },
  },
  contracts: {},
} as const satisfies Chain
