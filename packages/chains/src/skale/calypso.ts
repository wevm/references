import { Chain } from '../types'

export const calypso = {
  id: 1_564_830_818,
  name: 'SKALE | Calypso NFT Hub',
  network: 'calypso',
  nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague'],
    },
    public: {
      http: ['https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Blockscout',
      url: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com',
    },
    default: {
      name: 'Blockscout',
      url: 'https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com',
    },
  },
  contracts: {},
} as const satisfies Chain
