import { Chain } from './types'

export const bronos = {
  id: 1039,
  name: 'Bronos',
  network: 'bronos',
  nativeCurrency: {
    decimals: 18,
    name: 'BRO',
    symbol: 'BRO',
  },
  rpcUrls: {
    default: { http: ['https://evm.bronos.org'] },
    public: { http: ['https://evm.bronos.org'] },
  },
  websiteUrl: 'https://bronos.org/',
  blockExplorers: {
    default: { name: 'BronoScan', url: 'https://broscan.bronos.org' },
  },
} as const satisfies Chain
