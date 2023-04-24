import { Chain } from './types'

export const ekta = {
  id: 1994,
  name: 'Ekta Chain',
  network: 'ekta',
  nativeCurrency: {
    decimals: 18,
    name: 'EKTA',
    symbol: 'EKTA',
  },
  rpcUrls: {
    public: { http: ['https://main.ekta.io'] },
    default: { http: ['https://main.ekta.io'] },
  },
  blockExplorers: {
    default: { name: 'Ektascan', url: 'https://ektascan.io' },
  },
  testnet: false,
} as const satisfies Chain
