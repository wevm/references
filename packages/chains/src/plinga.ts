import { Chain } from './types'

export const plinga = {
  id: 242,
  name: 'Plinga AI Chain',
  network: 'plinga',
  nativeCurrency: {
    decimals: 18,
    name: 'Plinga',
    symbol: 'PLINGA',
  },
  rpcUrls: {
    default: { http: ['https://rpcurl.mainnet.plgchain.com'] },
    public: { http: ['https://rpcurl.mainnet.plgchain.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'PlgScan', url: 'https://www.plgscan.com' },
    default: { name: 'PlgScan', url: 'https://www.plgscan.com' },
  },
  contracts: {
    multicall3: {
      address: '0x45936F98C594D8ed17b1D895162797BD2E774b45',
      blockCreated: 5044,
    },
  },
} as const satisfies Chain
