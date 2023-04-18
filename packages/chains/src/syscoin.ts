import { Chain } from './types'

export const syscoin = {
  id: 57,
  name: 'Syscoin Mainnet',
  network: 'syscoin',
  nativeCurrency: {
    decimals: 8,
    name: 'Syscoin',
    symbol: 'SYS',
  },
  rpcUrls: {
    default: { http: ['https://rpc.syscoin.org'] },
    public: { http: ['https://rpc.syscoin.org'] },
  },
  blockExplorers: {
    etherscan: { name: 'SyscoinExplorer', url: 'https://explorer.syscoin.org' },
    default: { name: 'SyscoinExplorer', url: 'https://explorer.syscoin.org' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 268670,
    },
  },
} as const satisfies Chain
