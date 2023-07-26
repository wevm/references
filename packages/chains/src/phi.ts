import { Chain } from './types'

export const phi = {
  id: 144,
  name: 'Phi',
  network: 'PHI',
  nativeCurrency: { name: 'PHI', symbol: 'PHI', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://connect.phi.network'],
      webSocket: ['wss://connect.phi.network],
    },
    infura: {
      http: ['https://connect.phi.network'],
      webSocket: ['wss://connect.phi.network'],
    },
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
  },
  contracts: {
    multicall3: {
      address: '0xc2f41B404a6757863AAeF49ff93039421acCd630',
      blockCreated: 360030,
    },
  },
} as const satisfies Chain
