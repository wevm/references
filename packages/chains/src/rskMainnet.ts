import { Chain } from './types'

export const rskMainnet = {
  id: 30,
  name: 'RSK Mainnet',
  network: 'rsk',
  nativeCurrency: {
    decimals: 18,
    name: 'RSK Mainnet',
    symbol: 'RBTC',
  },
  rpcUrls: {
    public: {
      http: ['https://public-node.rsk.co'],
    },
    default: {
      http: ['https://public-node.rsk.co'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'RSK Explorer',
      url: 'https://explorer.rsk.co',
    },
    default: {
      name: 'RSK Explorer',
      url: 'https://explorer.rsk.co',
    },
  },
} as const satisfies Chain
