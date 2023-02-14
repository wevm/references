import {
  Chain,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  normalizeChainId,
} from '@wagmi/core'
import type EthereumProviderType from '@walletconnect/ethereum-provider'
import { providers } from 'ethers'
import { getAddress, hexValue } from 'ethers/lib/utils.js'

import { Connector } from './base'

// -- Types --------------------------------------------------------------------
type RpcMethod =
  | 'personal_sign'
  | 'eth_sendTransaction'
  | 'eth_accounts'
  | 'eth_requestAccounts'
  | 'eth_call'
  | 'eth_getBalance'
  | 'eth_sendRawTransaction'
  | 'eth_sign'
  | 'eth_signTransaction'
  | 'eth_signTypedData'
  | 'eth_signTypedData_v3'
  | 'eth_signTypedData_v4'
  | 'wallet_switchEthereumChain'
  | 'wallet_addEthereumChain'
  | 'wallet_getPermissions'
  | 'wallet_requestPermissions'
  | 'wallet_registerOnboarding'
  | 'wallet_watchAsset'
  | 'wallet_scanQRCode'

type RpcEvent =
  | 'accountsChanged'
  | 'chainChanged'
  | 'message'
  | 'disconnect'
  | 'connect'

type WalletConnectOptions = {
  projectId: string
  qrcode?: boolean
  methods?: RpcMethod[]
  events?: RpcEvent[]
}

type ConnectorConfig = { chains?: Chain[]; options: WalletConnectOptions }

type ConnectArguments = { chainId?: number; pairingTopic?: string }

type ChainIdArguments = { chainId?: number }

// -- Constants ----------------------------------------------------------------
const NAMESPACE = 'eip155'

// -- Connector ----------------------------------------------------------------
export class WalletConnectConnector extends Connector<
  EthereumProviderType,
  WalletConnectOptions,
  providers.JsonRpcSigner
> {
  readonly id = 'walletConnect'
  readonly name = 'WalletConnect'
  readonly ready = true

  #provider?: EthereumProviderType
  #initProviderPromise?: Promise<void>

  constructor(config: ConnectorConfig) {
    super(config)
    this.#createProvider()
  }

  // -- Public -----------------------------------------------------------------

  /**
   * Connect to provider
   * @param chainId - Sets default chain to connect to
   * @param pairingTopic - If provided, will attempt to connect to an existing pairing
   */
  async connect({ chainId, pairingTopic }: ConnectArguments = {}) {
    try {
      const provider = await this.getProvider()
      const isChainsAuthorized = await this.#isChainsAuthorized()
      this.#setProviderListeners(provider)
      const requiredChainId = chainId ?? this.chains[0]?.id

      // Throw error, we need at least one configured chain to connect to
      if (!requiredChainId) {
        throw new Error('No chains provided in wagmi config')
      }

      // If there is an active session with unauthorised chains, disconnect
      if (provider.session && !isChainsAuthorized) await provider.disconnect()

      // If there no active session, or the chains are not authorized, connect
      if (!provider.session || !isChainsAuthorized) {
        const optionalChains = this.chains
          .filter((chain) => chain.id !== requiredChainId)
          .map((optionalChain) => optionalChain.id)

        await provider.connect({
          pairingTopic,
          chains: [requiredChainId],
          optionalChains,
        })

        provider.signer.setDefaultChain(this.#getCaipChainId(requiredChainId))
      }

      // If session exists and chains are authorisedf, enable provider
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

  /**
   * Disconnect, set up event listeners and silence non-critical errors
   */
  async disconnect() {
    const provider = await this.getProvider()
    try {
      await provider.disconnect()
    } catch (error) {
      if (!/No matching key/i.test((error as Error).message)) throw error
    } finally {
      this.#removeProviderListeners(provider)
    }
  }

  async getAccount() {
    const provider = await this.getProvider()
    const accounts = provider.accounts
    return getAddress(accounts[0]!)
  }

  async getChainId() {
    const provider = await this.getProvider()
    const chainId = normalizeChainId(provider.chainId)
    return chainId
  }

  async getProvider({ chainId }: ChainIdArguments = {}) {
    if (!this.#provider) await this.#createProvider()
    if (chainId) {
      this.#provider!.signer.setDefaultChain(this.#getCaipChainId(chainId))
    }
    return this.#provider!
  }

  async getSigner({ chainId }: ChainIdArguments = {}) {
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
   * Switches to only pre-approved chains and emmits chainChanged event.
   * Will error if user is switching to unsupported chain.
   */
  async switchChain(chainId: number) {
    const provider = await this.getProvider()
    const id = hexValue(chainId)

    try {
      provider.signer.setDefaultChain(this.#getCaipChainId(chainId))
      return (
        this.chains.find((x) => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
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

  // -- Private ----------------------------------------------------------------

  async #createProvider() {
    if (!this.#initProviderPromise && typeof window !== 'undefined') {
      this.#initProviderPromise = this.#initProvider()
    }
    return this.#initProviderPromise
  }

  async #initProvider() {
    const { default: EthereumProvider } = await import(
      '@walletconnect/ethereum-provider'
    )
    const [requiredChain, ...optionalChains] = this.chains.map(({ id }) => id)
    if (requiredChain) {
      // EthereumProvider populates & deduplicates required methods and events internally
      this.#provider = await EthereumProvider.init({
        showQrModal: this.options.qrcode !== false,
        projectId: this.options.projectId,
        optionalMethods: this.options.methods,
        optionalEvents: this.options.events,
        chains: [requiredChain],
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

  #getCaipChainId(chainId: number) {
    return `${NAMESPACE}:${chainId}`
  }

  #setProviderListeners(provider: EthereumProviderType) {
    provider.on('accountsChanged', this.onAccountsChanged)
    provider.on('chainChanged', this.onChainChanged)
    provider.on('disconnect', this.onDisconnect)
    provider.on('session_delete', this.onDisconnect)
    provider.on('display_uri', this.onDisplayUri)
    provider.on('connect', this.onConnect)
  }

  #removeProviderListeners(provider: EthereumProviderType) {
    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
    provider.removeListener('session_delete', this.onDisconnect)
    provider.removeListener('display_uri', this.onDisplayUri)
    provider.removeListener('connect', this.onConnect)
  }

  // -- Protected --------------------------------------------------------------

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: getAddress(accounts[0]!) })
  }

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId)
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
