import { Chain } from './types'

export const bitciTest = {
    id: 1907,
    name: 'Bitci Test Chain',
    network: 'bitcitest',
    nativeCurrency: {
        decimals: 18,
        name: 'BITCI',
        symbol: 'tBITCI',
    },
    rpcUrls: {
        default: { http: ['https://testnet.bitcichain.com'] },
        public: { http: ['https://testnet.bitcichain.com'] },
    },
    blockExplorers: {
        default: {
            name: 'BITCI Explorer',
            url: 'https://bitciexplorer.com/',
        },
    },
    contracts: {
        multicall3: {
            address: '0xe1E63664E4056d5aa5CA8a628b4FCd363bbd95a2',
            blockCreated: 1172400,
        },
    },
} as const satisfies Chain
