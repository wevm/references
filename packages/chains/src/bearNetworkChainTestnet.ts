import { Chain } from './types'

export const bearNetworkChainTestnet = {
  id: 751230,
  name: 'Bear Network Chain Testnet',
  network: 'BearNetworkChainTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'tBRNKC',
    symbol: 'tBRNKC',
  },
  rpcUrls: {
    public: { http: ['https://brnkc-test.bearnetwork.net'] },
    default: { http: ['https://brnkc-test.bearnetwork.net'] },
  },
  blockExplorers: {
    default: {
      name: 'BrnkTestScan',
      url: 'https://brnktest-scan.bearnetwork.net',
    },
  },
  testnet: true,
} as const satisfies Chain
