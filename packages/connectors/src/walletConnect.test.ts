import { foundry, goerli, mainnet } from '@wagmi/core/chains'
import { testChains } from '@wagmi/core/internal/test'
import WalletConnectProvider from '@walletconnect/ethereum-provider'
import { UniversalProvider } from '@walletconnect/universal-provider'
import { describe, expect, it } from 'vitest'

import { WalletConnectConnector } from './walletConnect'

const defaultChains = [mainnet, goerli]

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

  it('should use v1 by default', async () => {
    const connector = new WalletConnectConnector({
      chains: defaultChains,
      options: {
        rpc: {
          [foundry.id]: foundry.rpcUrls.default.http[0]!,
        },
      },
    })
    expect(await connector.getProvider()).instanceOf(WalletConnectProvider)
  })

  it('should use v1 as configured by options', async () => {
    const connector = new WalletConnectConnector({
      chains: defaultChains,
      options: {
        rpc: {
          [foundry.id]: foundry.rpcUrls.default.http[0]!,
        },
        version: '1',
      },
    })
    expect(await connector.getProvider()).instanceOf(WalletConnectProvider)
  })

  it('should use v2 as configured by options', async () => {
    const connector = new WalletConnectConnector({
      chains: defaultChains,
      options: {
        projectId: 'test',
        version: '2',
      },
    })
    expect(await connector.getProvider()).instanceOf(UniversalProvider)
  })
})
