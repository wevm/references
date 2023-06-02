import { Chain } from './types'

export const canto = {
  id: 7_700,
  name: 'Canto',
  network: 'canto',
  nativeCurrency: {
    decimals: 18,
    name: 'Canto',
    symbol: 'CANTO',
  },
  rpcUrls: {
    default: { http: ['https://canto.slingshot.finance'] },
    public: { http: ['https://canto.slingshot.finance'] },
  },
  blockExplorers: {
    default: {
      name: 'Canto EVM Explorer (Blockscout)',
      url: 'https://evm.explorer.canto.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 2905789,
    },
  },
} as const satisfies Chain
