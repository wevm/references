import {
  Chain,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  getClient,
} from '@wagmi/core'
import type WalletConnectProvider from '@walletconnect/ethereum-provider'
import { providers } from 'ethers'
import { getAddress, hexValue } from 'ethers/lib/utils.js'

import { Connector } from './base'

type WalletConnectOptions = { projectId: string; qrcode?: boolean }
type WalletConnectSigner = providers.JsonRpcSigner

type ConnectConfig = {
  /** Target chain to connect to. */
  chainId?: number
  /** If provided, will attempt to connect to an existing pairing. */
  pairingTopic?: string
}

const NAMESPACE = 'eip155'
export class WalletConnectConnector extends Connector<
  WalletConnectProvider,
  WalletConnectOptions,
  WalletConnectSigner
> {
  readonly id = 'walletConnect'
  readonly name = 'WalletConnect'
  readonly ready = true

  #provider?: WalletConnectProvider
  #initProviderPromise?: Promise<void>

  constructor(config: { chains?: Chain[]; options: WalletConnectOptions }) {
    super(config)
    this.#createProvider()
  }

  async connect({ chainId, pairingTopic }: ConnectConfig = {}) {
    try {
      let targetChainId = chainId
      if (!targetChainId) {
        const lastUsedChainId = getClient().lastUsedChainId
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId))
          targetChainId = lastUsedChainId
        else targetChainId = this.chains[0]?.id
      }
      if (!targetChainId) throw new Error('No chains found on connector.')

      const provider = await this.getProvider()
      this.#setupListeners()

      const isChainsAuthorized = await this.#isChainsAuthorized()

      // If there is an active session with unauthorised chains, disconnect
      if (provider.session && !isChainsAuthorized) await provider.disconnect()

      // If there no active session, or the chains are not authorized, connect
      if (!provider.session || !isChainsAuthorized) {
        const optionalChains = this.chains
          .filter((chain) => chain.id !== targetChainId)
          .map((optionalChain) => optionalChain.id)

        this.emit('message', { type: 'connecting' })

        await provider.connect({
          pairingTopic,
          chains: [targetChainId],
          optionalChains,
        })
      }

      // If session exists and chains are authorized, enable provider for required chain
      await this.switchChain(targetChainId)
      const accounts = await provider.enable()
      const account = getAddress(accounts[0]!)
      const id = await this.getChainId()
      const unsupported = this.isChainUnsupported(id)

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(provider),
      }
    } catch (error) {
      if (/user rejected/i.test((error as ProviderRpcError)?.message)) {
        throw new UserRejectedRequestError(error)
      }
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    try {
      await provider.disconnect()
    } catch (error) {
      if (!/No matching key/i.test((error as Error).message)) throw error
    } finally {
      this.#removeListeners()
    }
  }

  async getAccount() {
    const { accounts } = await this.getProvider()
    return getAddress(accounts[0]!)
  }

  async getChainId() {
    const { chainId } = await this.getProvider()
    return chainId
  }

  async getProvider({ chainId }: { chainId?: number } = {}) {
    if (!this.#provider) await this.#createProvider()
    if (chainId) await this.switchChain(chainId)
    return this.#provider!
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
      this.getAccount(),
    ])
    return new providers.Web3Provider(provider, chainId).getSigner(account)
  }

  async isAuthorized() {
    try {
      const [account, isChainsAuthorized] = await Promise.all([
        this.getAccount(),
        this.#isChainsAuthorized(),
      ])

      return !!account && isChainsAuthorized
    } catch {
      return false
    }
  }

  /**
   * Switches to only pre-approved chains and emits `chainChanged` event.
   * Will error if user is switching to unsupported chain.
   */
  async switchChain(chainId: number) {
    const provider = await this.getProvider()
    const chain = this.chains.find((chain) => chain.id === chainId)

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexValue(chainId) }],
      })

      // Return chain object or default config
      return (
        chain ?? {
          id: chainId,
          name: `Chain ${chainId}`,
          network: `${chainId}`,
          nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
          rpcUrls: { default: { http: [''] }, public: { http: [''] } },
        }
      )
    } catch (error) {
      const message =
        typeof error === 'string' ? error : (error as ProviderRpcError)?.message
      if (/user rejected request/i.test(message)) {
        throw new UserRejectedRequestError(error)
      }
      throw new SwitchChainError(error)
    }
  }

  async #createProvider() {
    if (!this.#initProviderPromise && typeof window !== 'undefined') {
      this.#initProviderPromise = this.#initProvider()
    }
    return this.#initProviderPromise
  }

  async #initProvider() {
    const {
      default: EthereumProvider,
      OPTIONAL_EVENTS,
      OPTIONAL_METHODS,
    } = await import('@walletconnect/ethereum-provider')
    const [defaultChain, ...optionalChains] = this.chains.map(({ id }) => id)
    if (defaultChain) {
      // EthereumProvider populates & deduplicates required methods and events internally
      this.#provider = await EthereumProvider.init({
        showQrModal: this.options.qrcode !== false,
        projectId: this.options.projectId,
        optionalMethods: OPTIONAL_METHODS,
        optionalEvents: OPTIONAL_EVENTS,
        chains: [defaultChain],
        optionalChains: optionalChains,
        rpcMap: Object.fromEntries(
          this.chains.map((chain) => [
            chain.id,
            chain.rpcUrls.default.http[0]!,
          ]),
        ),
      })
    }
  }

  /**
   * Check if all chains from session namespace are also present in
   * connector's chains array.
   */
  async #isChainsAuthorized() {
    const { signer } = await this.getProvider()
    const providerChains = signer.namespaces?.[NAMESPACE]?.chains || []
    const namespaceChains = providerChains.map((chain) =>
      parseInt(chain.split(':')[1] || ''),
    )
    const connectorChains = this.chains.map(({ id }) => id)
    return namespaceChains.every((id) => connectorChains.includes(id))
  }

  #setupListeners() {
    if (!this.#provider) return
    this.#removeListeners()
    this.#provider.on('accountsChanged', this.onAccountsChanged)
    this.#provider.on('chainChanged', this.onChainChanged)
    this.#provider.on('disconnect', this.onDisconnect)
    this.#provider.on('session_delete', this.onDisconnect)
    this.#provider.on('display_uri', this.onDisplayUri)
    this.#provider.on('connect', this.onConnect)
  }

  #removeListeners() {
    if (!this.#provider) return
    this.#provider.removeListener('accountsChanged', this.onAccountsChanged)
    this.#provider.removeListener('chainChanged', this.onChainChanged)
    this.#provider.removeListener('disconnect', this.onDisconnect)
    this.#provider.removeListener('session_delete', this.onDisconnect)
    this.#provider.removeListener('display_uri', this.onDisplayUri)
    this.#provider.removeListener('connect', this.onConnect)
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: getAddress(accounts[0]!) })
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = Number(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect = () => {
    this.emit('disconnect')
  }

  protected onDisplayUri = (uri: string) => {
    this.emit('message', { type: 'display_uri', data: uri })
  }

  protected onConnect = () => {
    this.emit('connect', { provider: this.#provider })
  }
}
