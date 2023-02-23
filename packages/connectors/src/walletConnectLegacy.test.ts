import { foundry } from '@wagmi/core/chains'
import { testChains } from '@wagmi/core/internal/test'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { WalletConnectLegacyConnector } from './walletConnectLegacy'

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

describe('WalletConnectLegacy', () => {
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn',
    })

    const matchMedia = vi.fn().mockImplementation((query) => {
      return {
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }
    })
    vi.stubGlobal('matchMedia', matchMedia)
  })

  afterEach(() => server.resetHandlers())

  afterAll(() => server.close())

  it('inits', () => {
    const connector = new WalletConnectLegacyConnector({
      chains: testChains,
      options: {
        rpc: {
          [foundry.id]: foundry.rpcUrls.default.http[0]!,
        },
      },
    })
    expect(connector.name).toEqual('WalletConnectLegacy')
  })
})
