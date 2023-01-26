import { Chain } from './types'

export const filecoinHyperspace = {
  id: 3141,
  name: 'Filecoin Hyperspace',
  network: 'filecoin-hyperspace',
  nativeCurrency: {
    decimals: 18,
    name: 'testnet filecoin',
    symbol: 'tFIL',
  },
  rpcUrls: {
    default: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
    public: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
  },
  blockExplorers: {
    default: { name: 'Filfox', url: 'https://hyperspace.filfox.info/en' },
    gilf: { name: 'Glif', url: 'https://explorer.glif.io/?network=hyperspace' },
  },
} as const satisfies Chain
