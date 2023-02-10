import { Chain } from './types'

export const goerli = {
  id: 5,
  network: 'goerli',
  name: 'Goerli',
  nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    alchemy: {
      http: ['https://eth-goerli.g.alchemy.com/v2'],
      webSocket: ['wss://eth-goerli.g.alchemy.com/v2'],
    },
    infura: {
      http: ['https://goerli.infura.io/v3'],
      webSocket: ['wss://goerli.infura.io/ws/v3'],
    },
    default: {
      http: ['https://rpc.ankr.com/eth_goerli'],
    },
    public: {
      http: ['https://rpc.ankr.com/eth_goerli'],
    },
  },
  blockExplorers: {
    etherscan: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
    },
    default: {
      name: 'Etherscan',
      url: 'https://goerli.etherscan.io',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0x687c30Cc44bFA39A1449e86E172BF002E7b3f0b0',
      blockCreated: 7725078,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 6507670,
    },
  },
  testnet: true,
} as const satisfies Chain
