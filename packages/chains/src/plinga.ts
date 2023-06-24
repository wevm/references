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
      address: '0x0A236b3887C5D520DF0278a76f24a642eCd6bA33',
      blockCreated: 83861,
    },
  },
} as const satisfies Chain
