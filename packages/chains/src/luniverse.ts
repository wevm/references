import { Chain } from './types'

export const luniverse = {
  id: 256,
  name: 'Luniverse',
  network: 'Luniverse Mainnet',
  nativeCurrency: { name: 'LUK', symbol: 'LUK', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://main-rpc.the-balance.io:18545'],
    },
    public: {
      http: ['https://main-rpc.the-balance.io:18545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Luniversescan',
      url: 'https://scan.luniverse.io',
    },
  },
} as const satisfies Chain
