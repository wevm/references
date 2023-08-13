import { Chain } from './types'

export const sapphireTestnet = {
  id: 23295,
  name: 'Oasis Sapphire Testnet',
  network: 'sapphireTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Oasis TEST',
    symbol: 'TEST',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.dev'],
      webSocket: ['wss://testnet.sapphire.oasis.dev/ws'],
    },
    public: {
      http: ['https://testnet.sapphire.oasis.dev'],
      webSocket: ['wss://testnet.sapphire.oasis.dev/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/testnet/sapphire',
    },
  },
} as const satisfies Chain
