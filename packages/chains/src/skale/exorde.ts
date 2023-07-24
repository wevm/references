import { Chain } from '../types'

export const skaleExorde = {
  id: 2_139_927_552,
  name: 'SKALE | Exorde',
  network: 'skale-exorde',
  nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.skalenodes.com/v1/light-vast-diphda'],
      webSocket: ['wss://mainnet.skalenodes.com/v1/ws/light-vast-diphda'],
    },
    public: {
      http: ['https://mainnet.skalenodes.com/v1/light-vast-diphda'],
      webSocket: ['wss://mainnet.skalenodes.com/v1/ws/light-vast-diphda'],
    },
  },
  blockExplorers: {
    blockscout: {
      name: 'SKALE Explorer',
      url: 'https://light-vast-diphda.explorer.mainnet.skalenodes.com',
    },
    default: {
      name: 'SKALE Explorer',
      url: 'https://light-vast-diphda.explorer.mainnet.skalenodes.com',
    },
  },
  contracts: {},
} as const satisfies Chain
