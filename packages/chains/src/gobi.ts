import { Chain } from 'wagmi'
 
export const gobi = {
  id: 1_663,
  name: 'Horizen Gobi Testnet',
  network: 'gobi',
  nativeCurrency: {
    decimals: 18,
    name: 'Test ZEN',
    symbol: 'tZEN',
  },
  rpcUrls: {
    public: { http: ['https://gobi-testnet.horizenlabs.io/ethv1'] },
    default: { http: ['https://gobi-testnet.horizenlabs.io/ethv1'] },
  },
  blockExplorers: {
    etherscan: { name: 'Gobi Explorer', url: 'https://gobi-explorer.horizen.io/' },
    default: { name: 'Gobi Explorer', url: 'https://gobi-explorer.horizen.io/' },
  },
  contracts: {
  },
  testnet: true,
} as const satisfies Chain
