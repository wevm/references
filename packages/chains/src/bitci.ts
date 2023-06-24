import { Chain } from './types'

export const bitci = {
    id: 1907,
    name: 'Bitci Chain',
    network: 'bitci',
    nativeCurrency: {
        decimals: 18,
        name: 'BITCI',
        symbol: 'BITCI',
    },
    rpcUrls: {
        default: { http: ['https://rpc.bitci.com'] },
        public: { http: ['https://rpc.bitci.com'] },
    },
    blockExplorers: {
        default: {
            name: 'BITCI Explorer',
            url: 'https://bitciexplorer.com/',
        },
    },
    contracts: {
        multicall3: {
            address: '0x72dC4C76372c746eB974F97aD70EEB974a7382f4',
            blockCreated: 6976614,
        },
    },
} as const satisfies Chain
