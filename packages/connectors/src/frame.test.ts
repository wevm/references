import Provider from 'ethereum-provider'
import { vi, describe, expect, it, vitest } from 'vitest'

import { testChains } from '../test'
import { FrameConnector, FrameInjectedProvider } from './frame'
import { WindowProvider } from './types'
import { EventEmitter } from 'stream'

const ethProviderMock = vi.fn()
const ethProviderMockRequest = vi.fn()
const ethProviderMockClose = vi.fn()

vi.mock('eth-provider', () => ({
  default: ethProviderMock.mockImplementation(() =>
    Promise.resolve({
      request: ethProviderMockRequest,
      close: ethProviderMockClose,
      removeListener: vi.fn(),
    }),
  ),
}))

class FrameProvider extends Provider {}

class FrameConnection extends EventEmitter {
  constructor() {
    super()
    setTimeout(() => this.emit('connect'), 0)
  }

  async send() {
    // empty
  }

  close() {
    this.emit('close')
  }
}

describe('FrameConnector', () => {
  it('inits', () => {
    const connector = new FrameConnector({
      chains: testChains,
    })
    expect(connector.name).toEqual('Frame')
  })

  it('connects via the injected provider', async () => {
    window.ethereum = new FrameProvider(new FrameConnection())
    ;(window.ethereum as FrameInjectedProvider).isFrame = true
    ;(window.ethereum as FrameInjectedProvider).request = vitest
      .fn()
      .mockImplementation(
        (requestArgs: { method: string }) =>
          new Promise((resolve) => {
            resolve(
              requestArgs.method === 'eth_requestAccounts'
                ? ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B']
                : [],
            )
          }),
      )

    const connector = new FrameConnector({
      chains: testChains,
    })
    const connection = await connector.connect()
    expect(connection.account).toEqual(
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    )
  })

  it('connects via eth-provider when no injected provider exists', async () => {
    window.ethereum = undefined
    const connector = new FrameConnector({
      chains: testChains,
    })
    ethProviderMockRequest.mockImplementation(
      (requestArgs: { method: string }) =>
        new Promise((resolve) => {
          resolve(
            requestArgs.method === 'eth_requestAccounts'
              ? ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B']
              : [],
          )
        }),
    )
    const connection = await connector.connect()
    expect(ethProviderMock).toHaveBeenCalledWith('frame')
    expect(connection.account).toEqual(
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    )
  })

  it('connects via eth-provider when the injected provider is not Frame', async () => {
    window.ethereum = new FrameProvider(new FrameConnection())
    ;(window.ethereum as WindowProvider).isMetaMask = true
    const connector = new FrameConnector({
      chains: testChains,
    })
    ethProviderMockRequest.mockImplementation(
      (requestArgs: { method: string }) =>
        new Promise((resolve) => {
          resolve(
            requestArgs.method === 'eth_requestAccounts'
              ? ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B']
              : [],
          )
        }),
    )
    const provider = (await connector.getProvider()) as Provider
    const connection = await connector.connect()
    expect(connection.account).toEqual(
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    )
    expect((provider as unknown as WindowProvider).isMetaMask).toBe(undefined)
  })

  it('disconnects via the injected provider', async () => {
    window.ethereum = new FrameProvider(new FrameConnection())
    ;(window.ethereum as FrameInjectedProvider).isFrame = true
    ;(window.ethereum as FrameInjectedProvider).request = vitest
      .fn()
      .mockImplementation(
        (requestArgs: { method: string }) =>
          new Promise((resolve) => {
            resolve(
              requestArgs.method === 'eth_requestAccounts'
                ? ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B']
                : [],
            )
          }),
      )

    const connector = new FrameConnector({
      chains: testChains,
    })
    const connection = await connector.connect()
    expect(connection.account).toEqual(
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    )
    await connector.disconnect()
    expect((window.ethereum as unknown as Provider).isConnected()).toEqual(
      false,
    )
  })

  it('disconnects via eth-provider', async () => {
    window.ethereum = undefined
    const connector = new FrameConnector({
      chains: testChains,
    })
    ethProviderMockRequest.mockImplementation(
      (requestArgs: { method: string }) =>
        new Promise((resolve) => {
          resolve(
            requestArgs.method === 'eth_requestAccounts'
              ? ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B']
              : [],
          )
        }),
    )
    await connector.disconnect()
    expect(ethProviderMockClose).toHaveBeenCalledOnce()
  })

  it('switches chains', async () => {
    window.ethereum = new FrameProvider(new FrameConnection())
    ;(window.ethereum as FrameInjectedProvider).isFrame = true
    ;(window.ethereum as FrameInjectedProvider).request = vitest
      .fn()
      .mockImplementation(
        (requestArgs: { method: string }) =>
          new Promise((resolve) => {
            const responseMap = {
              eth_requestAccounts: () =>
                resolve(['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B']),
              eth_chainId: () => resolve({ chainId: 1 }),
              wallet_switchEthereumChain: () =>
                (window.ethereum as FrameInjectedProvider).emit(
                  'chainChanged',
                  { chainId: 5 },
                ),
            }
            responseMap[requestArgs.method as keyof typeof responseMap]()
          }),
      )
    const connector = new FrameConnector({
      chains: testChains,
    })
    await connector.connect()
    await new Promise((resolve) => {
      ;(window.ethereum as FrameInjectedProvider).on(
        'chainChanged',
        ({ chainId }) => {
          expect(chainId).toEqual(5)
          resolve(true)
        },
      )
      connector.switchChain(5)
    })
  })

  it('switches accounts', async () => {
    const frameConnection = new FrameConnection()
    window.ethereum = new FrameProvider(frameConnection)
    ;(window.ethereum as FrameInjectedProvider).isFrame = true
    ;(window.ethereum as FrameInjectedProvider).request = vitest
      .fn()
      .mockImplementation(
        (requestArgs: { method: string }) =>
          new Promise((resolve) => {
            resolve(
              requestArgs.method === 'eth_requestAccounts'
                ? [
                    '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
                    '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                  ]
                : [],
            )
          }),
      )
    const connector = new FrameConnector({
      chains: testChains,
    })
    await connector.connect()
    await new Promise((resolve) => {
      connector.on('change', ({ account }) => {
        expect(account).toEqual('0x71C7656EC7ab88b098defB751B7401B5f6d8976F')
        resolve(true)
      })
      ;(window.ethereum as FrameInjectedProvider).emit('accountsChanged', [
        '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      ])
    })
  })
})
