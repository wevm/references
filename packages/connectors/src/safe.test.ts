import { testChains } from '@wagmi/core/internal/test'
import { describe, expect, it } from 'vitest'

import { SafeConnector } from './safe'

describe('SafeConnector', () => {
  it('inits', () => {
    const connector = new SafeConnector({
      chains: testChains,
      options: {
        allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
        debug: false,
      },
    })
    expect(connector.name).toEqual('Safe')
  })
})
