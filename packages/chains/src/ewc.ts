import { Chain } from './types'

export const ewc = {
  id: 246,
  name: 'Energy Web Chain',
  network: 'ewc',
  nativeCurrency: { name: 'EWT', symbol: 'EWT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.energyweb.org'],
    },
    public: {
      http: ['https://rpc.energyweb.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Energy Web Chain Explorer',
      url: 'https://explorer.energyweb.org',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x0A6d64413c07E10E890220BBE1c49170080C6Ca0',
    },
  },
} as const satisfies Chain
