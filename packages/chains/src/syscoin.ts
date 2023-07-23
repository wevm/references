import { Chain } from './types'

export const syscoin = {
  id: 57,
  name: 'Syscoin Mainnet',
  network: 'syscoin',
  nativeCurrency: {
    decimals: 18,
    name: 'Syscoin',
    symbol: 'SYS',
  },
  rpcUrls: {
    default: { http: ['https://rpc.syscoin.org'] },
    public: { http: ['https://rpc.syscoin.org'] },
  },
  blockExplorers: {
    default: { name: 'SyscoinExplorer', url: 'https://explorer.syscoin.org' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 287139,
    },
  },
} as const satisfies Chain
