import { Chain } from './types'

export const iotexTestnet: Chain = {
  id: 4689,
  name: 'IoTeX Testnet',
  network: 'iotex-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IoTeX',
    symbol: 'IOTX',
  },
  rpcUrls: {
    default: {
      http: ['https://babel-api.testnet.iotex.io'],
      webSocket: ['wss://babel-api.testnet.iotex.io']
    },
  },
  blockExplorers: {
    etherscan: { name: 'IoTeXScan', url: 'https://testnet.iotexscan.io' },
    default: { name: 'IoTeXScan', url: 'https://testnet.iotexscan.io' },
  }
}
