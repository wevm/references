import { Chain } from './types'


export const opBNB = {
    id: 204,
    name: 'opBNB',
    network: 'opBNB Mainnet',
    nativeCurrency: {
        decimals: 18,
        name: 'BNB',
        symbol: 'BNB',
    },
    rpcUrls: {
        public: { http: [' https://opbnb-mainnet-rpc.bnbchain.org'] },
        default: { http: [' https://opbnb-mainnet-rpc.bnbchain.org'] },
    },
    blockExplorers: {
        etherscan: { name: 'opbnbscan', url: 'https://mainnet.opbnbscan.com' },
        default: { name: 'opbnbscan', url: 'https://mainnet.opbnbscan.com' },
    },
    contracts: {
        multicall3: {
          address: '0xcA11bde05977b3631167028862bE2a173976CA11',
          blockCreated: 512881,
        },
      },
} as const satisfies Chain

