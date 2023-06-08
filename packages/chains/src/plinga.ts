import { Chain } from './types'

export const plinga = {
  id: 242,
  name: 'Plinga Smart Chain',
  network: 'plgchain',
  nativeCurrency: {
    decimals: 18,
    name: 'Plinga',
    symbol: 'Plinga',
  },
  rpcUrls: {
    default: { http: ['https://rpcurl.mainnet.plgchain.com'] },
    public: { http: ['https://rpcurl.mainnet.plgchain.plinga.technology'] },
  },
  blockExplorers: {
    etherscan: { name: 'PlgScan', url: 'https://www.plgscan.com' },
    default: { name: 'PlgScan', url: 'https://www.plgscan.com' },
  },
  contracts: {
    multicall3: {
      address: '0x1f22B66Dd127eAC499A40A774c934e123cF31F40',
      blockCreated: 1455,
    },
  },
} as const satisfies Chain
