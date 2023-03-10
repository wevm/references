import { Chain } from '../types'

export const brawl = {
  id: 391_845_894,
  name: 'Block Brawlers',
  network: 'brawl',
  nativeCurrency: { name: 'BRAWL', symbol: 'BRAWL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.skalenodes.com/v1/frayed-decent-antares'],
    },
    public: {
      http: ['https://mainnet.skalenodes.com/v1/frayed-decent-antares'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Blockscout',
      url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com',
    },
    default: {
      name: 'Blockscout',
      url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com',
    },
  },
  contracts: {},
} as const satisfies Chain
