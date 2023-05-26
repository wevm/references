import { Chain } from './types'

export const edgeware = {
  id: 2021,
  name: 'Edgeware EdgeEVM Mainnet',
  network: 'edgeware',
  nativeCurrency: {
    decimals: 18,
    name: 'Edgeware',
    symbol: 'EDG',
  },
  rpcUrls: {
    default: { http: ['https://edgeware-evm.jelliedowl.net'] },
    public: { http: ['https://edgeware-evm.jelliedowl.net'] },
  },
  blockExplorers: {
    etherscan: { name: 'Edgscan by Bharathcoorg', url: 'https://edgscan.live' },
    default: { name: 'Edgscan by Bharathcoorg', url: 'https://edgscan.live' },
  },
  contracts: {
    multicall3: {
      address: '0xDDF47eEB4e5FF4AA60e063E0Ec4f7C35B47Ed445',
      blockCreated: 17126780,
    },
  },
} as const satisfies Chain
