import { defineConfig } from 'tsup'

import { getConfig } from '../../scripts/tsup'

export default defineConfig(
  getConfig({
    entry: [
      'src/index.ts',
      'src/injected.ts',
      'src/coinbaseWallet.ts',
      'src/metaMask.ts',
      'src/mock/index.ts',
      'src/walletConnect.ts',
    ],
    platform: 'browser',
  }),
)
