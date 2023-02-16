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

type WalletConnectOptions = {
  projectId: string
  qrcode?: boolean
  /* If provided, will disconnect user when dapp adds new / unnaproved chain */
  disconnectOnAddChain?: boolean
}
type WalletConnectSigner = providers.JsonRpcSigner

type ConnectConfig = {
  /** Target chain to connect to. */
  chainId?: number
  /** If provided, will attempt to connect to an existing pairing. */
  pairingTopic?: string
}

const NAMESPACE = 'eip155'
const REQUESTED_CHAINS_KEY = 'wagmi.requestedChains'
const ADD_ETH_CHAIN_METHOD = 'wallet_addEthereumChain'
const SWITHC_ETH_CHAIN_METHOID = 'wallet_switchEthereumChain'

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

        this.#setRequestedChainsIds(this.chains.map(({ id }) => id))
      }

      // If session exists and chains are authorized, enable provider for required chain
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
      this.#setRequestedChainsIds([])
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
    try {
      const provider = await this.getProvider()
      const namespaceChains = this.#getNamespaceChainsIds()
      const namespaceMethods = this.#getNamespaceMethods()
      const chain = this.chains.find((chain) => chain.id === chainId)

      if (!chain) throw new SwitchChainError(chainId)

      // Switch to already pre-approved chain
      if (namespaceChains.includes(chainId)) {
        await provider.request({
          method: SWITHC_ETH_CHAIN_METHOID,
          params: [{ chainId: hexValue(chainId) }],
        })
      }
      // Add chain to wallet if add method is supported
      else if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
        await provider.request({
          method: ADD_ETH_CHAIN_METHOD,
          params: [
            {
              chainId: hexValue(chain.id),
              blockExplorerUrls: [chain.blockExplorers?.default],
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [...chain.rpcUrls.default.http],
            },
          ],
        })
        const requestedChains = this.#getRequestedChainsIds()
        requestedChains.push(chainId)
        this.#setRequestedChainsIds(requestedChains)
      }

      return chain
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
   * Check if all chains from session namespace are supported by dapp
   * Check if dapp added new chains
   *    If yes check that wallet supports wallet_addEthereumChain
   *    Also check that disconnectOnAddChain is not set
   */
  async #isChainsAuthorized() {
    const namespaceChains = this.#getNamespaceChainsIds()
    const namespaceMethods = this.#getNamespaceMethods()
    const connectorChains = this.chains.map(({ id }) => id)
    const requestedChains = this.#getRequestedChainsIds()
    const isValidNamespaceChains = namespaceChains.every((id) =>
      connectorChains.includes(id),
    )
    const isValidRequestedChains = connectorChains.every((id) =>
      requestedChains.includes(id),
    )
    const isAddChain =
      namespaceMethods.includes(ADD_ETH_CHAIN_METHOD) &&
      !this.options.disconnectOnAddChain

    return (
      isValidNamespaceChains &&
      (isValidRequestedChains || (!isValidRequestedChains && isAddChain))
    )
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

  #setRequestedChainsIds(chains: number[]) {
    localStorage.setItem(REQUESTED_CHAINS_KEY, JSON.stringify(chains))
  }

  #getRequestedChainsIds(): number[] {
    const data = localStorage.getItem(REQUESTED_CHAINS_KEY)
    return data ? JSON.parse(data) : []
  }

  #getNamespaceChainsIds() {
    if (!this.#provider) return []
    const chainIds = this.#provider.session?.namespaces[NAMESPACE]?.chains?.map(
      (chain) => parseInt(chain.split(':')[1] || ''),
    )
    return chainIds ?? []
  }

  #getNamespaceMethods() {
    if (!this.#provider) return []
    const methods = this.#provider.session?.namespaces[NAMESPACE]?.methods
    return methods ?? []
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
    this.#setRequestedChainsIds([])
    this.emit('disconnect')
  }

  protected onDisplayUri = (uri: string) => {
    this.emit('message', { type: 'display_uri', data: uri })
  }

  protected onConnect = () => {
    this.emit('connect', { provider: this.#provider })
  }
}
