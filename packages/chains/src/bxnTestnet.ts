import { Chain } from './types'

export const bxnTestnet = {
  id: 4777,
  name: 'BlackFort Exchange Network Testnet',
  network: 'bxnTestnet',
  nativeCurrency: {
    name: 'BlackFort Testnet Token',
    symbol: 'TBXN',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.blackfort.network/rpc'],
    },
    public: {
      http: ['https://testnet.blackfort.network/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://testnet-explorer.blackfort.network',
    },
  },
} as const satisfies Chain
