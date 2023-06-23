import { Chain } from './types'

export const baseGoerli = {
  id: 84531,
  network: 'base-goerli',
  name: 'Base Goerli',
  nativeCurrency: { name: 'Base Goerli', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://goerli.base.org'],
    },
    public: {
      http: ['https://goerli.base.org'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Basescan',
      url: 'https://goerli.basescan.org',
    },
    default: {
      name: 'Basescan',
      url: 'https://goerli.basescan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 1376988,
    },
  },
  testnet: true,
} as const satisfies Chain
