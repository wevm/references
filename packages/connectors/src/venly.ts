import { VenlyProvider, VenlyProviderOptions } from '@venly/web3-provider'
import {
  ChainNotConfiguredError,
  SwitchChainError,
  UserRejectedRequestError,
  normalizeChainId,
} from '@wagmi/core'
import type { ProviderRpcError } from '@wagmi/core'
import type { Chain } from '@wagmi/core/chains'
import { providers } from 'ethers'
import { getAddress, hexValue } from 'ethers/lib/utils.js'

import { Connector } from './base'

type Options = Omit<VenlyProviderOptions, 'reloadOnDisconnect'> & {
  /**
   * Fallback Ethereum JSON RPC URL
   * @default ""
   */
  jsonRpcUrl?: string
  /**
   * Fallback Ethereum Chain ID
   * @default 1
   */
  chainId?: number
  /**
   * Whether or not to reload dapp automatically after disconnect.
   */
  reloadOnDisconnect?: boolean
}

export class VenlyConnector extends Connector<
  VenlyProvider,
  Options,
  providers.JsonRpcSigner
> {
  readonly id = 'venly'
  readonly name = 'Venly'
  readonly ready = true

  client: VenlyProvider = new VenlyProvider()
  provider: any

  constructor({ chains, options }: { chains?: Chain[]; options: Options }) {
    super({
      chains,
      options,
    })
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      this.provider = await this.client.createProvider(this.options)

      this.provider.on('accountsChanged', this.onAccountsChanged)
      this.provider.on('chainChanged', this.onChainChanged)
      this.provider.on('disconnect', this.onDisconnect)

      this.emit('message', { type: 'connecting' })

      const account = await this.getAccount()
      // Switch to chain if provided
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(
          this.provider as unknown as providers.ExternalProvider,
        ),
      }
    } catch (error) {
      if (
        /(user closed modal|accounts received is empty)/i.test(
          (error as ProviderRpcError).message,
        )
      )
        throw new UserRejectedRequestError(error)
      throw error
    }
  }

  async disconnect() {
    if (!this.provider) return

    this.provider.removeListener('accountsChanged', this.onAccountsChanged)
    this.provider.removeListener('chainChanged', this.onChainChanged)
    this.provider.removeListener('disconnect', this.onDisconnect)

    this.provider = null
  }

  async getAccount() {
    const accounts = await this.provider.request({
      method: 'eth_accounts',
    })
    // return checksum address
    return getAddress(accounts[0] as string)
  }

  async getChainId() {
    const chainId = await this.provider.request({
      method: 'eth_chainId',
    })
    return normalizeChainId(chainId)
  }

  getProvider() {
    return this.provider
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ])
    return new providers.Web3Provider(
      provider as providers.ExternalProvider,
      chainId,
    ).getSigner(account)
  }

  async isAuthorized() {
    try {
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  async switchChain(chainId: number) {
    const id = hexValue(chainId)

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: id }],
      })
      return (
        this.chains.find((x) => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
          rpcUrls: { default: { http: [''] }, public: { http: [''] } },
        }
      )
    } catch (error) {
      const chain = this.chains.find((x) => x.id === chainId)
      if (!chain)
        throw new ChainNotConfiguredError({ chainId, connectorId: this.id })

      if (this.isUserRejectedRequestError(error))
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
  }

  isUserRejectedRequestError(error: unknown) {
    return /(user rejected)/i.test((error as Error).message)
  }
}
