import { Chain } from './types'

export const meterTestnet = {
  id: 83,
  name: 'Meter Testnet',
  network: 'meterTestnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Meter Stable',
    symbol: 'MTR',
  },
  rpcUrls: {
    default: { http: ['https://rpctest.meter.io'] },
    public: { http: ['https://rpctest.meter.io'] },
  },
  blockExplorers: {
    etherscan: { name: 'MeterScan', url: 'https://scan-warringstakes.meter.io' },
    default: { name: 'MeterScan', url: 'https://scan-warringstakes.meter.io' },
  },
  contracts: {
  },
  testnet:true,
} as const satisfies Chain
