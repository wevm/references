import { Chain } from './types'

export const bitciTest = {
    id: 1908,
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
            address: '0x2c7a2166C8d89c03D8c04640fD93560FD19fcAF4',
            blockCreated: 1179269,
        },
    },
} as const satisfies Chain
