import { Chain } from './types'

export const zhejiang = {
  id: 1337803,
  network: 'zhejiang',
  name: 'Zhejiang',
  nativeCurrency: { name: 'Zhejiang Ether', symbol: 'ZhejETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.zhejiang.ethpandaops.io'],
    },
    public: {
      http: ['https://rpc.zhejiang.ethpandaops.io'],
    },
  },
  blockExplorers: {
    beaconchain: {
      name: 'Etherscan',
      url: 'https://zhejiang.beaconcha.in',
    },
    default: {
      name: 'Beaconchain',
      url: 'https://zhejiang.beaconcha.in',
    },
  },
  testnet: true,
} as const satisfies Chain
