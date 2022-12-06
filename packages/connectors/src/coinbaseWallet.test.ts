import { foundry } from '@wagmi/core/chains'
import { testChains } from '@wagmi/core/internal/test'
import { describe, expect, it } from 'vitest'

import { CoinbaseWalletConnector } from './coinbaseWallet'

describe('CoinbaseWalletConnector', () => {
  it('inits', () => {
    const connector = new CoinbaseWalletConnector({
      chains: testChains,
      options: {
        appName: 'wagmi',
        jsonRpcUrl: foundry.rpcUrls.default.http[0],
      },
    })
    expect(connector.name).toEqual('Coinbase Wallet')
  })
})
