import { Chain } from './types'

export const gnosis: Chain = {
  id: 100,
  name: 'Gnosis Chain formerly xDai',
  network: 'gnosis',
  nativeCurrency: {
    decimals: 18,
    name: 'xDai',
    symbol: 'xDAI',
  },
  rpcUrls: {
    default: { http: ['https://rpc.gnosischain.com'] },
  },
  blockExplorers: {
    etherscan: { name: 'Gnosis Chain Explorer', url: 'https://blockscout.com/xdai/mainnet/' },
    default: { name: 'Gnosis Chain Explorer', url: 'https://blockscout.com/xdai/mainnet/' },
  },
}
