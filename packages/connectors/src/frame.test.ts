import { testChains } from '@wagmi/core/internal/test'
import { describe, expect, it } from 'vitest'

import { FrameConnector } from './frame'

describe('FrameConnector', () => {
  it('inits', () => {
    const connector = new FrameConnector({
      chains: testChains,
    })
    expect(connector.name).toEqual('Frame')
  })
})
