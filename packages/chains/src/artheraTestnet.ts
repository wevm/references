import { Chain } from './types'

export const artheraTestnet = {
  id: 10243,
  name: 'Arthera Testnet',
  network: 'arthera-tesnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Arthera',
    symbol: 'AA',
  },
  rpcUrls: {
    default: { http: ['https://rpc-test.arthera.net'] },
    public: { http: ['https://rpc-test.arthera.net'] },
  },
  blockExplorers: {
    default: { name: 'Arthera Explorer', url: 'https://explorer-test.arthera.net/' },
  },
  testnet: true,
} as const satisfies Chain
