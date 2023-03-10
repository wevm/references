import { Chain } from '../types'

export const skaleEuropaTestnet = {
  id: 476_158_412,
  name: 'SKALE | Europa Liquidity Hub Testnet',
  network: 'skale-europa-testnet',
  nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor'],
    },
    public: {
      http: ['https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Blockscout',
      url: 'https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com',
    },
    default: {
      name: 'Blockscout',
      url: 'https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com',
    },
  },
  contracts: {},
} as const satisfies Chain
