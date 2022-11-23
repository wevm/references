import { defineConfig } from 'tsup'

import { getConfig } from '../../scripts/tsup'

export default defineConfig(
  getConfig({
    entry: ['src/index.ts'],
    platform: 'browser',
  }),
)
