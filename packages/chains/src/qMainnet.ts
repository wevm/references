import { Chain } from './types'

export const qMainnet = {
  id: 35441,
  name: 'Q Mainnet',
  network: 'q-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Q',
    symbol: 'Q',
  },
  rpcUrls: {
    default: { http: ['https://rpc.q.org'] },
    public: { http: ['https://rpc.q.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Q Mainnet Explorer',
      url: 'https://explorer.q.org',
    },
  },
} as const satisfies Chain
