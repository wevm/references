import { Chain } from './types'

export const edgewareTestnet = {
  id: 2022,
  name: 'Beresheet BereEVM Testnet',
  network: 'edgewareTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Testnet EDG',
    symbol: 'tEDG',
  },
  rpcUrls: {
    default: { http: ['https://beresheet-evm.jelliedowl.net'] },
    public: { http: ['https://beresheet-evm.jelliedowl.net'] },
  },
  websiteUrl: 'https://www.edgeware.io/',
  blockExplorers: {
    etherscan: {
      name: 'Edgscan by Bharathcoorg',
      url: 'https://testnet.edgscan.live',
    },
    default: {
      name: 'Edgscan by Bharathcoorg',
      url: 'https://testnet.edgscan.live',
    },
  },
} as const satisfies Chain
