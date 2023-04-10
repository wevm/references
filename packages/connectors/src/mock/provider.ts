import { default as EventEmitter } from 'eventemitter3'
import { UserRejectedRequestError, getAddress } from 'viem'

import { Signer } from '../types'

export type MockProviderOptions = {
  chainId: number
  flags?: {
    isAuthorized?: boolean
    failConnect?: boolean
    failSwitchChain?: boolean
    noSwitchChain?: boolean
  }
  signer: Signer
}

type Events = {
  accountsChanged(accounts: string[]): void
  chainChanged(chainId: number | string): void
  disconnect(): void
}
type Event = keyof Events

export class MockProvider {
  events = new EventEmitter<Events>()

  chainId: number
  #options: MockProviderOptions
  #signer?: Signer

  constructor(options: MockProviderOptions) {
    this.chainId = options.chainId
    this.#options = options
  }

  async enable() {
    if (this.#options.flags?.failConnect)
      throw new UserRejectedRequestError(new Error('Failed to connect.'))
    if (!this.#signer) this.#signer = this.#options.signer
    const address = this.#signer.account.address
    this.events.emit('accountsChanged', [address])
    return [address]
  }

  async disconnect() {
    this.events.emit('disconnect')
    this.#signer = undefined
  }

  async getAccounts() {
    const address = this.#signer?.account.address
    if (!address) return []
    return [getAddress(address)]
  }

  getSigner() {
    const signer = this.#signer
    if (!signer) throw new Error('Signer not found')
    return signer
  }

  async switchChain(chainId: number) {
    if (this.#options.flags?.failSwitchChain)
      throw new UserRejectedRequestError(new Error('Failed to switch chain.'))
    this.#options.chainId = chainId
    this.chainId = chainId
    this.events.emit('chainChanged', chainId)
  }

  async switchSigner(signer: Signer) {
    const address = signer.account.address
    this.#signer = signer
    this.events.emit('accountsChanged', [address])
  }

  async watchAsset(_asset: {
    address: string
    decimals?: number
    image?: string
    symbol: string
  }) {
    return true
  }

  async request({ method, params }: any) {
    return this.#signer?.transport.request({ method, params })
  }

  on(event: Event, listener: (...args: any[]) => void) {
    this.events.on(event, listener)
    return this
  }

  removeListener(event: Event, listener: (...args: any[]) => void) {
    this.events.removeListener(event, listener)
    return this
  }

  toJSON() {
    return '<MockProvider>'
  }
}
