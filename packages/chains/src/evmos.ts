import { Chain } from './types'

export const evmos: Chain = {
  id: 9001,
  name: 'Evmos',
  network: 'evmos',
  nativeCurrency: {
    decimals: 18,
    name: 'Evmos',
    symbol: 'EVMOS',
  },
  rpcUrls: {
    default: { http: ['https://eth.bd.evmos.org:8545'] },
  },
  blockExplorers: {
    default: { name: 'Evmos Block Explorer', url: 'https://escan.live/' },
  },
}
