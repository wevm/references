import { Chain } from './types'

export const polygonZkEvmTestnet = {
  id: 1442,
  name: 'Polygon zkEVM Testnet',
  network: 'polygon-zkevm-testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.public.zkevm-test.net'],
    },
    public: {
      http: ['https://rpc.public.zkevm-test.net'],
    },
  },
  websiteUrl: 'https://polygon.technology/',
  blockExplorers: {
    blockscout: {
      name: 'Blockscout',
      url: 'https://explorer.public.zkevm-test.net',
    },
    default: {
      name: 'PolygonScan',
      url: 'https://testnet-zkevm.polygonscan.com',
    },
  },
  testnet: true,
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 525686,
    },
  },
} as const satisfies Chain
