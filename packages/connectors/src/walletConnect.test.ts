import { foundry } from '@wagmi/core/chains'
import { testChains } from '@wagmi/core/internal/test'
import { describe, expect, it } from 'vitest'

import { WalletConnectConnector } from './walletConnect'

describe('WalletConnectConnector', () => {
  it('inits', () => {
    const connector = new WalletConnectConnector({
      chains: testChains,
      options: {
        rpc: {
          [foundry.id]: foundry.rpcUrls.default.http[0]!,
        },
      },
    })
    expect(connector.name).toEqual('WalletConnect')
  })
})
