import { Chain } from './types'

export const zoraTestnet = {
  id: 999,
  name: 'ZORA Goerli Testnet',
  network: 'zora-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ZORA Goerli',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.zora.co'],
      webSocket: ['wss://testnet.rpc.zora.co'],
    },
    public: {
      http: ['https://testnet.rpc.zora.co'],
      webSocket: ['wss://testnet.rpc.zora.co'],
    },
  },
  blockExplorers: {
    etherscan: { name: 'ZORA', url: 'https://testnet.explorer.zora.co' },
    default: { name: 'ZORA', url: 'https://testnet.explorer.zora.co' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 189123,
    },
  },
  testnet: true,
} as const satisfies Chain
