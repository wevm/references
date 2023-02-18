import { Chain } from './types'

export const harmonyOne = {
  id: 1666600000,
  name: 'Harmony One',
  network: 'harmony',
  nativeCurrency: {
    name: 'Harmony',
    symbol: 'ONE',
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/harmony'] },
    default: { http: ['https://rpc.ankr.com/harmony'] },
  },
  blockExplorers: {
    etherscan: { name: 'Ankr', url: 'https://rpc.ankr.com/harmony' },
    default: { name: 'Ankr', url: 'https://rpc.ankr.com/harmony' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 24185753,
    },
  },
} as const satisfies Chain
