import { Chain } from './types'

export const zkSyncTestnet: Chain = {
  id: 280,
  name: 'zkSync Testnet',
  network: 'zksync',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://zksync2-testnet.zksync.dev'],
      webSocket: ['wss://zksync2-testnet.zksync.dev/ws'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'zkScan',
      url: 'https://zksync2-testnet.zkscan.io/',
    },
    default: {
      name: 'zkScan',
      url: 'https://zksync2-testnet.zkscan.io/',
    },
  },
  testnet: true,
}
