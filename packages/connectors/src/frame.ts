import {
  Chain,
  ConnectorNotFoundError,
  ProviderRpcError,
  RpcError,
  SwitchChainError,
  UserRejectedRequestError,
  getClient,
  normalizeChainId,
} from '@wagmi/core'
import Provider from 'ethereum-provider'
import { providers } from 'ethers'
import { getAddress, hexValue } from 'ethers/lib/utils.js'

import type { ConnectorData } from './base'
import { Connector } from './base'

export type FrameConnectorOptions = {
  /**
   * MetaMask and other injected providers do not support programmatic disconnect.
   * This flag simulates the disconnect behavior by keeping track of connection status in storage. See [GitHub issue](https://github.com/MetaMask/metamask-extension/issues/10353) for more info.
   * @default true
   */
  shimDisconnect?: boolean
}

export class FrameConnector extends Connector<Provider> {
  readonly id = 'frame'
  readonly name = 'Frame'
  readonly ready = true
  protected shimDisconnectKey = `${this.id}.shimDisconnect`
  private isInjected = () => true

  #provider?: Provider

  constructor({
    chains,
    options: suppliedOptions,
  }: {
    chains?: Chain[]
    options?: FrameConnectorOptions
  } = {}) {
    const isInjected = () =>
      !!(typeof window !== 'undefined' && window.ethereum?.isFrame)
    const options = {
      shimDisconnect: true,
      getProvider: async () => {
        if (!isInjected()) {
          const ethProvider = (await import('eth-provider')).default
          return ethProvider('frame')
        }

        return Promise.resolve(window.ethereum as unknown as Provider)
      },
      ...suppliedOptions,
    }
    super({ chains, options })
    this.isInjected = isInjected
  }

  async connect(): Promise<Required<ConnectorData>> {
    try {
      const provider = await this.getProvider()
      if (!provider) {
        throw new ConnectorNotFoundError()
      }

      if (provider.on) {
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

      this.emit('message', { type: 'connecting' })

      const accounts = (await provider.request({
        method: 'eth_requestAccounts',
      })) as string[]
      const account = getAddress(accounts[0] as string)
      const id = await this.getChainId()
      const unsupported = this.isChainUnsupported(id)

      // Enable support for programmatic chain switching
      this.switchChain = this.#switchChain

      // Add shim to storage signalling wallet is connected
      getClient().storage?.setItem(this.shimDisconnectKey, true)

      return {
        account,
        chain: { id, unsupported },
        provider,
      }
    } catch (error) {
      if ((error as ProviderRpcError).code === 4001) {
        throw new UserRejectedRequestError(error)
      }
      if ((error as RpcError).code === -32002) {
        throw error instanceof Error ? error : new Error(String(error))
      }

      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    if (!provider.removeListener) {
      return
    }

    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)

    if (!this.isInjected()) {
      provider.close()
    }

    // Remove shim signalling wallet is disconnected
    getClient().storage?.removeItem(this.shimDisconnectKey)
  }

  async getAccount() {
    const provider = await this.getProvider()
    const accounts = (await provider.request({
      method: 'eth_accounts',
    })) as string[]
    const account = getAddress(accounts[0] as string)

    return account
  }

  async getChainId() {
    const provider = await this.getProvider()
    const chainId = (await provider.request({
      method: 'eth_chainId',
    })) as number

    return normalizeChainId(chainId)
  }

  async getProvider() {
    const provider = await this.options.getProvider()
    if (provider) {
      this.#provider = provider
    }
    return this.#provider as Provider
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ])
    return new providers.Web3Provider(
      provider as unknown as providers.ExternalProvider,
      chainId,
    ).getSigner(account)
  }

  async isAuthorized() {
    if (!getClient().storage?.getItem(this.shimDisconnectKey)) {
      return false
    }

    try {
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
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
      return (
        this.chains.find((x) => x.id === chainId) ??
        ({
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
          rpcUrls: { default: { http: [''] }, public: { http: [''] } },
        } as Chain)
      )
    } catch (error) {
      const message =
        typeof error === 'string' ? error : (error as ProviderRpcError)?.message
      if (/user rejected request/i.test(message))
        throw new UserRejectedRequestError(error)
      throw new SwitchChainError(error)
    }
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
    getClient().storage?.removeItem(this.shimDisconnectKey)
  }
}
