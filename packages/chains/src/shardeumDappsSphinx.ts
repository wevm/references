import { Chain } from './types'

export const shardeumSphinx = {
  id: 8082,
  name: 'Shardeum Sphinx 1.X',
  network: 'shmDappsSphinx',
  nativeCurrency: { name: 'SHARDEUM', symbol: 'SHM', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://dapps.shardeum.org'],
    },
    public: {
      http: ['https://dapps.shardeum.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Shardeum Explorer',
      url: 'https://explorer-dapps.shardeum.org',
    },
  }
} as const satisfies Chain
