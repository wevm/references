import { testChains } from '@wagmi/core/internal/test'

import EthereumProvider from 'ethereum-provider'
import { describe, expect, it, vitest } from 'vitest'

import { FrameConnector } from './frame'
import { Ethereum } from './types'
import { EventEmitter } from 'stream'

class FrameProvider extends EthereumProvider {}

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
    window.ethereum = new FrameProvider(
      new FrameConnection(),
    ) as unknown as Ethereum
    window.ethereum.isFrame = true
    window.ethereum.request = vitest.fn().mockImplementation(
      (requestArgs: { method: string }) =>
        new Promise((resolve) => {
          if (requestArgs.method === 'eth_requestAccounts')
            resolve(['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'])
          resolve([])
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
    const provider = await connector.getProvider()
    provider.request = vitest.fn().mockImplementation(
      (requestArgs: { method: string }) =>
        new Promise((resolve) => {
          if (requestArgs.method === 'eth_requestAccounts')
            resolve(['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'])
          resolve([])
        }),
    )
    const connection = await connector.connect()
    expect(connection.account).toEqual(
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    )
  })

  it('connects via eth-provider when the injected provider is not Frame', async () => {
    window.ethereum = new FrameProvider(
      new FrameConnection(),
    ) as unknown as Ethereum
    window.ethereum.isMetaMask = true

    const connector = new FrameConnector({
      chains: testChains,
    })
    const provider = await connector.getProvider()
    provider.request = vitest.fn().mockImplementation(
      (requestArgs: { method: string }) =>
        new Promise((resolve) => {
          if (requestArgs.method === 'eth_requestAccounts')
            resolve(['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'])
          resolve([])
        }),
    )
    const connection = await connector.connect()
    expect(connection.account).toEqual(
      '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    )
    expect(connection.provider.isMetaMask).toBe(undefined)
  })

  it.todo('disconnects')

  it.todo('switches chains')

  it.todo('switches accounts')

  it.todo('sends a transaction')

  it.todo('signs a message')
})
