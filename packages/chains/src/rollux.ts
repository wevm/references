import { Chain } from './types'

export const rollux = {
  id: 570,
  name: 'Rollux Mainnet',
  network: 'rollux',
  nativeCurrency: {
    decimals: 18,
    name: 'Syscoin',
    symbol: 'SYS',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.rollux.com'],
      webSocket: ['wss://rpc.rollux.com/wss'],
    },
    public: { http: ['https://rollux.public-rpc.com'] },
  },
  blockExplorers: {
    default: { name: 'RolluxExplorer', url: 'https://explorer.rollux.com' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 119222,
    },
  },
} as const satisfies Chain
