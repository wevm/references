import { defineConfig } from 'tsup'

import { getConfig } from '../../scripts/tsup'

export default defineConfig(
  getConfig({
    dev: process.env.DEV === 'true',
    entry: [
      'src/coinbaseWallet.ts',
      'src/index.ts',
      'src/injected.ts',
      'src/ledger.ts',
      'src/metaMask.ts',
      'src/mock/index.ts',
      'src/walletConnect.ts',
    ],
    platform: 'browser',
  }),
)
