import { Chain } from 'wagmi'
 
export const eon = {
  id: 7_332,
  name: 'Horizen EON',
  network: 'eon',
  nativeCurrency: {
    decimals: 18,
    name: 'ZEN',
    symbol: 'ZEN',
  },
  rpcUrls: {
    public: { http: ['https://eon-rpc.horizenlabs.io/ethv1'] },
    default: { http: ['https://eon-rpc.horizenlabs.io/ethv1'] },
  },
  blockExplorers: {
    etherscan: { name: 'EON Explorer', url: 'https://eon-explorer.horizenlabs.io/' },
    default: { name: 'EON Explorer', url: 'https://eon-explorer.horizenlabs.io/' },
  },
  contracts: {
  },
} as const satisfies Chain
