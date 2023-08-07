import { Chain } from './types'

export const sapphireTestnet = {
  id: 0x5aff,
  name: 'Oasis Sapphire Testnet',
  network: 'sapphireTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Oasis Testnet ROSE',
    symbol: 'tROSE',
  },
  rpcUrls: {
    default: { http: ['https://testnet.sapphire.oasis.dev'] },
    public: { http: ['https://testnet.sapphire.oasis.dev'] },
  },
  blockExplorers: {
    default: { name: 'Oasis Explorer', url: 'https://explorer.oasis.io/testnet/sapphire' },
  },
} as const satisfies Chain
