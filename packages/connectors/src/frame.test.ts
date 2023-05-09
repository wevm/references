import Provider from 'ethereum-provider'
import { describe, expect, it, vi, vitest } from 'vitest'

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

class Connection extends EventEmitter {
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

type MetamaskInjectedProvider = Provider & {
  providers: WindowProvider[]
  isMetaMask: true
}

function createInjectedProvider({ isFrame } = { isFrame: true }) {
  window.ethereum = new Provider(new Connection())
  let injectedProvider
  if (isFrame) {
    injectedProvider = window.ethereum as FrameInjectedProvider
    injectedProvider.isFrame = true
  } else {
    injectedProvider = window.ethereum as MetamaskInjectedProvider
    injectedProvider.isMetaMask = true
  }

  return injectedProvider
}

describe('FrameConnector', () => {
  it('inits', () => {
    const connector = new FrameConnector({
      chains: testChains,
    })
    expect(connector.name).toEqual('Frame')
  })

  it('connects via the injected provider', async () => {
    const injectedProvider = createInjectedProvider()
    injectedProvider.request = vitest.fn().mockImplementation(
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
    createInjectedProvider({ isFrame: false })
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
    const injectedProvider = createInjectedProvider()
    injectedProvider.request = vitest.fn().mockImplementation(
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
    const injectedProvider = createInjectedProvider()
    injectedProvider.request = vitest.fn().mockImplementation(
      (requestArgs: { method: string }) =>
        new Promise((resolve) => {
          const responseMap = {
            eth_requestAccounts: () =>
              resolve(['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B']),
            eth_chainId: () => resolve({ chainId: 1 }),
            wallet_switchEthereumChain: () =>
              (window.ethereum as FrameInjectedProvider).emit('chainChanged', {
                chainId: 5,
              }),
          }
          responseMap[requestArgs.method as keyof typeof responseMap]()
        }),
    )

    const connector = new FrameConnector({
      chains: testChains,
    })
    await connector.connect()
    await new Promise((resolve) => {
      injectedProvider.on('chainChanged', ({ chainId }) => {
        expect(chainId).toEqual(5)
        resolve(true)
      })
      connector.switchChain(5)
    })
  })

  it('switches accounts', async () => {
    const injectedProvider = createInjectedProvider()
    injectedProvider.request = vitest.fn().mockImplementation(
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
      injectedProvider.emit('accountsChanged', [
        '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      ])
    })
  })
})
