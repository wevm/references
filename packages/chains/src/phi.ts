import { Chain } from './types'

export const phi = {
  id: 144,
  name: 'PHI Network v2',
  network: 'PHI',
  nativeCurrency: { name: 'PHI', symbol: 'PHI', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://connect.phi.network'],
    },
    public: {
      http: ['https://connect.phi.network'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Phiscan',
      url: 'https://phiscan.com',
    },
    default: {
      name: 'Phiscan',
      url: 'https://phiscan.com',
    },
  }
} as const satisfies Chain
