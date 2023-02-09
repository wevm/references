import {
  Chain,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  getClient,
  normalizeChainId,
} from '@wagmi/core'
import type EthereumProviderType from '@walletconnect/ethereum-provider'
import { providers } from 'ethers'
import { getAddress, hexValue } from 'ethers/lib/utils.js'

import { Connector } from './base'

// -- Types --------------------------------------------------------------------
type RpcMethod =
  // Added by ethereum provider as required even if not specified
  | 'personal_sign'
  | 'eth_sendTransaction'
  // Optional
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

  async connect({ chainId, pairingTopic }: ConnectArguments = {}) {
    try {
      let targetChainId = chainId
      if (!targetChainId) {
        const lastUsedChainId = getClient().lastUsedChainId
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId)) {
          targetChainId = lastUsedChainId
        }
      }

      const provider = await this.getProvider({ chainId: targetChainId })
      provider.on('accountsChanged', this.onAccountsChanged)
      provider.on('chainChanged', this.onChainChanged)
      provider.on('disconnect', this.onDisconnect)
      provider.on('session_delete', this.onDisconnect)
      provider.on('display_uri', this.onDisplayUri)
      provider.on('connect', this.onConnect)

      const isChainsAuthorized = await this.#isChainsAuthorized()

      // If there is an active session, and the chains are not authorized,
      // disconnect the session.
      if (provider.session && !isChainsAuthorized) await provider.disconnect()

      // If there is not an active session, or the chains are not authorized,
      // attempt to connect.
      if (!provider.session || (provider.session && !isChainsAuthorized)) {
        await provider.connect({ pairingTopic })
      }

      const accounts = await provider.enable()
      const account = getAddress(accounts[0]!)
      const id = await this.getChainId()
      const unsupported = this.isChainUnsupported(id)

      // In v2, chain switching is allowed programatically
      // as the user approves the chains when approving the pairing
      this.switchChain = this.#switchChain

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
      // If the session does not exist, we don't want to throw.
      if (!/No matching key/i.test((error as Error).message)) throw error
    }

    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
    provider.removeListener('session_delete', this.onDisconnect)
    provider.removeListener('display_uri', this.onDisplayUri)
    provider.removeListener('connect', this.onConnect)
  }

  async getAccount() {
    const provider = await this.getProvider()
    const accounts = (await provider.request({
      method: 'eth_accounts',
    })) as string[]

    // return checksum address
    return getAddress(accounts[0] as string)
  }

  async getChainId() {
    const provider = await this.getProvider()

    // WalletConnect v2 does not internally manage chainIds anymore, so
    // we need to retrieve it from the client, or request it from the provider
    // if none exists.
    return (
      getClient().data?.chain?.id ??
      normalizeChainId(await provider.request({ method: 'eth_chainId' }))
    )
  }

  async getProvider({ chainId }: { chainId?: number } = {}) {
    if (!this.#provider) await this.#createProvider()
    if (chainId) {
      this.#provider!.signer.setDefaultChain(this.#getCaipChainId(chainId))
    }

    return this.#provider!
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
      this.getAccount(),
    ])
    const provider_ = {
      ...provider,
      async request(args) {
        return await provider.request(args)
      },
    } as providers.ExternalProvider

    return new providers.Web3Provider(provider_, chainId).getSigner(account)
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

  async #initProvider() {
    const { default: EthereumProvider } = await import(
      '@walletconnect/ethereum-provider'
    )
    this.#provider = await EthereumProvider?.init({
      showQrModal: this.options.qrcode !== false,
      projectId: this.options.projectId,
      methods: this.options.methods,
      events: this.options.events,
      chains: this.chains.map(({ id }) => id),
      rpcMap: Object.fromEntries(
        this.chains.map((chain) => [chain.id, chain.rpcUrls.default.http[0]!]),
      ),
    })
  }

  async #createProvider() {
    if (!this.#initProviderPromise) {
      this.#initProviderPromise = this.#initProvider()
    }

    return this.#initProviderPromise
  }

  /**
   * @description Checks if the connector is authorized to access the requested chains.
   *
   * There could be a case where requested chains are out of sync with
   * the users' approved chains (e.g. the dapp could have added support
   * for an additional chain), hence the user will be unauthorized.
   */
  async #isChainsAuthorized() {
    const provider = await this.getProvider()
    const providerChains = provider.signer.namespaces?.[NAMESPACE]?.chains || []
    const authorizedChainIds = providerChains.map(
      (chain) => parseInt(chain.split(':')[1] || '') as Chain['id'],
    )
    return !this.chains.some(({ id }) => !authorizedChainIds.includes(id))
  }

  async #switchChain(chainId: number) {
    const provider = await this.getProvider()
    const id = hexValue(chainId)

    try {
      // Set up a race between `wallet_switchEthereumChain` & the `chainChanged` event
      // to ensure the chain has been switched. This is because there could be a case
      // where a wallet may not resolve the `wallet_switchEthereumChain` method, or
      // resolves slower than `chainChanged`.
      await Promise.race([
        provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: id }],
        }),
        new Promise((res) =>
          this.on('change', ({ chain }) => {
            if (chain?.id === chainId) res(chainId)
          }),
        ),
      ])
      provider.signer.setDefaultChain(this.#getCaipChainId(chainId))
      this.onChainChanged(chainId)

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

  #getCaipChainId(chainId: number) {
    return `${NAMESPACE}:${chainId}`
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: getAddress(accounts[0] as string) })
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
