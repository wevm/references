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
  contracts: {
    multicall3: {
      address: '0xcA11bDe05977B3631167028862BE2A173976cA11',
      blockCreated: 2771150,
    },
  },
} as const satisfies Chain
