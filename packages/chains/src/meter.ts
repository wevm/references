import { Chain } from './types'

export const meter = {
  id: 82,
  name: 'Meter',
  network: 'meter',
  nativeCurrency: {
    decimals: 18,
    name: 'Meter Stable',
    symbol: 'MTR',
  },
  rpcUrls: {
    default: { http: ['https://rpc.meter.io'] },
    public: { http: ['https://rpc.meter.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'MeterScan', url: 'https://scan.meter.io' },
    default: { name: 'MeterScan', url: 'https://scan.meter.io' },
  },
  contracts: {
  },
} as const satisfies Chain
