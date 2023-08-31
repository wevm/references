import {Chain} from './types'

export const dogechainTestnet = {
  id: 568,
  name: 'Dogechain Testnet',
  network: 'dogechain-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Testnet Doge',
    symbol: 'tDC',
  },
  rpcUrls: {
    default: { http: ['https://rpc-testnet.dogechain.dog'] },
    public: { http: ['https://rpc-testnet.dogechain.dog'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'TestnetDogeChainExplorer',
      url: 'https://explorer-testnet.dogechain.dog',
    },
    default: {
      name: 'TestnetDogeChainExplorer',
      url: 'https://explorer-testnet.dogechain.dog',
    },
  },
  testnet: true,
} as const satisfies Chain
