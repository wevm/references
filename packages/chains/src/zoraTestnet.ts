import { Chain } from './types'

export const zoraTestnet = {
  id: 999,
  name: 'Zora Goerli Testnet',
  network: 'zora-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Zora Goerli',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.rpc.zora.energy'],
      webSocket: ['wss://testnet.rpc.zora.energy'],
    },
    public: {
      http: ['https://testnet.rpc.zora.energy'],
      webSocket: ['wss://testnet.rpc.zora.energy'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.explorer.zora.energy' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 189123,
    },
  },
  testnet: true,
} as const satisfies Chain
