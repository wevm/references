import { Chain } from './types'

export const lineaTestnet = {
  id: 59140,
  name: 'Linea Testnet',
  network: 'linea-testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.goerli.linea.build'],
      webSocket: ['wss://rpc.goerli.linea.build'],
    },
    public: {
      http: ['https://rpc.goerli.linea.build'],
      webSocket: ['wss://rpc.goerli.linea.build'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BlockScout',
      url: 'https://explorer.goerli.linea.build',
    },
  },
  testnet: true,
} as const satisfies Chain
