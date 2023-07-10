import { Chain } from './types'

export const mantle = {
  id: 5000,
  name: 'Mantle',
  network: 'mantle',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: { http: ['https://rpc.mantle.xyz'] },
    public: { http: ['https://rpc.mantle.xyz'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'Mantle Testnet Explorer',
      url: 'https://explorer.mantle.xyz',
    },
    default: {
      name: 'Mantle Testnet Explorer',
      url: 'https://explorer.mantle.xyz',
    },
  },
} as const satisfies Chain
