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
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 4249540,
    },
  },
} as const satisfies Chain
