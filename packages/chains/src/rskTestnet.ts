import { Chain } from './types'

export const rskTestnet = {
  id: 31,
  name: 'RSK Testnet',
  network: 'rsktestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'RSK Testnet',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    public: {
      http: ['https://public-node.testnet.rsk.co'],
    },
    default: {
      http: ['https://public-node.testnet.rsk.co'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'RSK Testnet Explorer',
      url: 'https://explorer.testnet.rsk.co',
    },
    default: {
      name: 'RSK Testnet Explorer',
      url: 'https://explorer.testnet.rsk.co',
    },
  },
} as const satisfies Chain
