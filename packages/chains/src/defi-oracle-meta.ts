import { Chain } from './types'

export const defi-oracle-meta = {
  id: 138,
  name: 'Defi Oracle Meta Maonnet',
  network: 'defi0',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: [''],
      webSocket: [''],
    },
    infura: {
      http: [''],
      webSocket: [''],
    },
    default: {
      http: ['https://rpc.public-0138.defi-oracle.io'],
      webSocket: ['https://rpc.public-0138.defi-oracle.io'],
    },
    public: {
      http: ['https://rpc.public-0138.defi-oracle.io'],
      webSocket: ['https://rpc.public-0138.defi-oracle.io'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'EhherScan',
      url: 'https://etherscan.io',
    },
    default: {
      name: 'Quorum Explorer',
      url: 'https://public-0138.defi-oracle.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 25770160,
    },
  },
} as const satisfies Chain
