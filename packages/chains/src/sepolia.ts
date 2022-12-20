import { Chain } from './types'

export const sepolia: Chain = {
  id: 11_155_111,
  network: 'sepolia',
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
  rpcUrls: {
    infura: {
      http: ['https://sepolia.infura.io/v3'],
      webSocket: ['wss://sepolia.infura.io/ws/v3'],
    },
    default: {
      http: ['https://rpc.sepolia.org'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 6507670,
    },
  },
  testnet: true,
}
