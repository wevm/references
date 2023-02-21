import { Chain } from './types'

export const polygonMumbai = {
  id: 2330,
  name: 'Polygon Mumbai',
  network: 'maticmum',
  nativeCurrency: { name: 'Altcoinchain', symbol: 'ALT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc0.altcoinchain.org/rpc'],
    },
    public: {
      http: ['https://rpc0.altcoinchain.org/rpc'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'PolygonScan',
      url: 'http://expedition.altcoinchain.org',
    },
    default: {
      name: 'PolygonScan',
      url: 'http://expedition.altcoinchain.org',
    },
  },

  testnet: false,
} as const satisfies Chain
