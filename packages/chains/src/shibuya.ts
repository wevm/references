import { Chain } from './types'

export const shibuya = {
  id: 81,
  name: 'Shibuya Network',
  network: 'shibuya-network',
  nativeCurrency: {
    decimals: 18,
    name: 'shibuya',
    symbol: 'SBY',
  },
  rpcUrls: {
    default: { http: ['https://evm.shibuya.astar.network'] },
    public: { http: ['https://evm.shibuya.astar.network'] },
  },
  blockExplorers: {
    default: {
      name: 'Shibuya Explorer',
      url: 'https://shibuya.subscan.io',
    },
  },
  testnet: true,
} as const satisfies Chain
