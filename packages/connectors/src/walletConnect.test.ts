import { foundry, goerli, mainnet } from '@wagmi/core/chains'
import { testChains } from '@wagmi/core/internal/test'
import WalletConnectProvider from '@walletconnect/ethereum-provider'
import { UniversalProvider } from '@walletconnect/universal-provider'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { WalletConnectConnector } from './walletConnect'

const defaultChains = [mainnet, goerli]

const handlers = [
  rest.get('https://*.bridge.walletconnect.org', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        topic: '222781e3-3fad-4184-acde-077796bf0d3d',
        type: 'sub',
        payload: '',
        silent: true,
      }),
    )
  }),
]

const server = setupServer(...handlers)

describe('WalletConnectConnector', () => {
  beforeAll(() =>
    server.listen({
      onUnhandledRequest: 'warn',
    }),
  )

  afterEach(() => server.resetHandlers())

  afterAll(() => server.close())

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
        projectId: process.env.VITE_WC_PROJECT_ID!,
        version: '2',
      },
    })
    expect(await connector.getProvider()).instanceOf(UniversalProvider)
  })
})
