import { Chain } from './types'

export const bxn = {
  id: 4999,
  name: 'BlackFort Exchange Network',
  network: 'bxn',
  nativeCurrency: { name: 'BlackFort Token', symbol: 'BXN', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.blackfort.network/rpc'],
    },
    public: {
      http: ['https://mainnet.blackfort.network/rpc'],
    },
  },
  websiteUrl: 'https://blackfort.exchange/',
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.blackfort.network',
    },
  },
} as const satisfies Chain
