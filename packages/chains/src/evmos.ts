import { Chain } from './types'

export const evmos: Chain = {
  id: 9001,
  name: 'EVMOS',
  network: 'evmos',
  nativeCurrency: {
    decimals: 18,
    name: 'EVMOS',
    symbol: 'EVMOS',
  },
  rpcUrls: {
    default: { http: ['https://eth.bd.evmos.org:8545'] },
  },
  blockExplorers: {
    default: { name: 'Evmos Block Explorer', url: 'https://escan.live/' },
  },
}