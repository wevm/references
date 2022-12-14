import { Chain } from './types'

export const taraxaTestnet: Chain = {
  id: 842,
  name: 'Taraxa Testnet',
  network: 'taraxa-testnet',
  nativeCurrency: { name: 'Tara', symbol: 'TARA', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.taraxa.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Taraxa Explorer',
      url: 'https://explorer.testnet.taraxa.io',
    },
  },
  testnet: true,
}
