import { Chain } from './types'

export const xdc = {
  id: 50,
  name: 'XinFin Network',
  network: 'xdc',
  nativeCurrency: {
    decimals: 18,
    name: 'XDC',
    symbol: 'XDC',
  },
  rpcUrls: {
    default: { http: ['https://rpc.xinfin.network'] },
    public: { http: ['https://rpc.xinfin.network'] },
  },
  websiteUrl: 'https://xdc.org/',
  blockExplorers: {
    xinfin: { name: 'XinFin', url: 'https://explorer.xinfin.network' },
    default: { name: 'Blocksscan', url: 'https://xdc.blocksscan.io' },
  },
} as const satisfies Chain
