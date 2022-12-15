import { defineConfig } from 'tsup'

import { getConfig } from '../../scripts/tsup'
import { exports } from './package.json'

export default defineConfig(
  getConfig({
    dev: process.env.DEV === 'true',
    entry: ['src/index.ts'],
    exports,
    platform: 'browser',
  }),
)
