import { Chain } from './types'

export const shardeumDappsSphinx = {
  id: 8081,
  name: 'Shardeum Dapp Sphinx 1.X',
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
      name: 'Shardeum Dapps Explorer',
      url: 'https://explorer-dapps.shardeum.org',
    },
  },
  testnet: true,
} as const satisfies Chain
