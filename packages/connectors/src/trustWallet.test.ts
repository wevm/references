import { testChains } from '@wagmi/core/internal/test'
import { describe, expect, it } from 'vitest'

import { TrustWalletConnector } from './trustWallet'

describe('TrustWalletConnector', () => {
  it('inits', () => {
    const connector = new TrustWalletConnector({
      chains: testChains,
    })
    expect(connector.name).toEqual('Trust Wallet')
  })
})
