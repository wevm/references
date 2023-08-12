import { Chain } from './types'

export const volta = {
  id: 73799,
  name: 'Volta Chain',
  network: 'volta',
  nativeCurrency: { name: 'VT', symbol: 'VT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://volta-rpc.energyweb.org'],
    },
    public: {
      http: ['https://volta-rpc.energyweb.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Volta Explorer',
      url: 'https://volta-explorer.energyweb.org',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0xd7CeF70Ba7efc2035256d828d5287e2D285CD1ac',
    },
  },
} as const satisfies Chain
