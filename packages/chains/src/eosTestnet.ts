import { Chain } from './types'

export const eosTestnet = {
  id: 15557,
  name: 'EOS EVM Testnet',
  network: 'eos',
  nativeCurrency: {
    decimals: 18,
    name: 'EOS',
    symbol: 'EOS',
  },
  rpcUrls: {
    default: { http: ['https://api.testnet.evm.eosnetwork.com'] },
    public: { http: ['https://api.testnet.evm.eosnetwork.com'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'EOS EVM Testnet Explorer',
      url: 'https://explorer.testnet.evm.eosnetwork.com',
    },
    default: {
      name: 'EOS EVM Testnet Explorer',
      url: 'https://explorer.testnet.evm.eosnetwork.com',
    },
  },
  testnet: true,
} as const satisfies Chain
