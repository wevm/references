import { Chain } from './types'

export const metis: Chain = {
  id: 1_088,
  name: 'Metis',
  network: 'andromeda',
  nativeCurrency: {
    decimals: 18,
    name: 'Metis',
    symbol: 'METIS',
  },
  rpcUrls: {
    default: { http: ['https://andromeda.metis.io/?owner=1088'] },
  },
  blockExplorers: {
    default: {
      name: 'Andromeda Explorer',
      url: 'https://andromeda-explorer.metis.io',
    },
  },
}
