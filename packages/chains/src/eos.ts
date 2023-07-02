import { Chain } from './types'

export const eos = {
  id: 17777,
  name: 'EOS EVM',
  network: 'eos',
  nativeCurrency: {
    decimals: 18,
    name: 'EOS',
    symbol: 'EOS',
  },
  rpcUrls: {
    default: { http: ['https://api.evm.eosnetwork.com'] },
    public: { http: ['https://api.evm.eosnetwork.com'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'EOS EVM Explorer',
      url: 'https://explorer.evm.eosnetwork.com',
    },
    default: {
      name: 'EOS EVM Explorer',
      url: 'https://explorer.evm.eosnetwork.com',
    },
  },
} as const satisfies Chain
