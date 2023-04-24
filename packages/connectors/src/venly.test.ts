import { testChains } from '@wagmi/core/internal/test'
import { describe, expect, it } from 'vitest'

import { VenlyConnector } from './venly'

describe('VenlyConnector', () => {
  it('inits', () => {
    const connector = new VenlyConnector({
      chains: testChains,
      options: {
        clientId: 'wagmi',
      },
    })
    expect(connector.name).toEqual('Venly')
  })
})
