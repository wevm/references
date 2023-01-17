import { Chain } from './types'

export const crossbell: Chain = {
  id: 3737,
  network: 'crossbell',
  name: 'Crossbell',
  nativeCurrency: {
    decimals: 18,
    name: 'CSB',
    symbol: 'CSB',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.crossbell.io'],
    },
  },
  blockExplorers: {
    default: { name: 'CrossScan', url: 'https://scan.crossbell.io' },
  },
}
