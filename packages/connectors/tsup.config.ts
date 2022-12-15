import { defineConfig } from 'tsup'

import { getConfig } from '../../scripts/tsup'
import { dependencies, exports, peerDependencies } from './package.json'

export default defineConfig(
  getConfig({
    dev: process.env.DEV === 'true',
    entry: [
      'src/index.ts',
      'src/injected.ts',
      'src/coinbaseWallet.ts',
      'src/metaMask.ts',
      'src/mock/index.ts',
      'src/walletConnect.ts',
      'src/ledger.ts',
    ],
    exports,
    external: [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
    platform: 'browser',
  }),
)
