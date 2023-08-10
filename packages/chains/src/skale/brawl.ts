import { Chain } from '../types'

export const skaleBlockBrawlers = {
  id: 391_845_894,
  name: 'SKALE | Block Brawlers',
  network: 'skale-brawl',
  nativeCurrency: { name: 'BRAWL', symbol: 'BRAWL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.skalenodes.com/v1/frayed-decent-antares'],
      webSocket: ['wss://mainnet.skalenodes.com/v1/ws/frayed-decent-antares'],
    },
    public: {
      http: ['https://mainnet.skalenodes.com/v1/frayed-decent-antares'],
      webSocket: ['wss://mainnet.skalenodes.com/v1/ws/frayed-decent-antares'],
    },
  },
  blockExplorers: {
    blockscout: {
      name: 'SKALE Explorer',
      url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com',
    },
    default: {
      name: 'SKALE Explorer',
      url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com',
    },
  },
  contracts: {},
} as const satisfies Chain
