import { Chain } from './types'

export const arbitrum: Chain = {
  id: 842,
  name: 'Taraxa Testnet',
  network: 'taraxatest',
  nativeCurrency: { name: 'Tara', symbol: 'TARA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.taraxa.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Taraxa Explorer', url: 'https://explorer.testnet.taraxa.io/' },
  },
  testnet: true
}
