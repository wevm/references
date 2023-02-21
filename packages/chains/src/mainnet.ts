import { Chain } from './types'

export const mainnet = {
  id: 2330,
//  network: 'homestead',
  name: 'Altcoinchain',
  nativeCurrency: { name: 'Altcoinchain', symbol: 'ALT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc0.altcoinchain.org/rpc'],
    },
    public: {
      http: ['https://rpc0.altcoinchain.org/rpc'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'http://expedition.altcoinchain.org',
    },
    default: {
      name: 'Etherscan',
      url: 'http://expedition.altcoinchain.org',
    },
  },
} as const satisfies Chain
