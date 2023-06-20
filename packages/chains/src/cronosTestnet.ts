import { Chain } from './types'

export const cronosTestnet = {
  id: 338,
  name: 'Cronos Testnet',
  network: 'cronos-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CRO',
    symbol: 'tCRO',
  },
  rpcUrls: {
    default: { http: ['https://evm-t3.cronos.org'] },
    public: { http: ['https://evm-t3.cronos.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Cronos Explorer',
      url: 'https://cronos.org/explorer/testnet3',
    },
  },
  testnet: true,
} as const satisfies Chain
