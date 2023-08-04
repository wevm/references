import { Chain } from './types'

export const sparknet = {
  id: 122,
  name: 'Sparknet',
  network: 'fuse',
  nativeCurrency: { name: 'Spark', symbol: 'SPARK', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.fusespark.io'] },
    public: { http: ['https://rpc.fusespark.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Sparkent Explorer',
      url: 'https://explorer.fusespark.io/',
    },
  },
  testnet: true,
} as const satisfies Chain
