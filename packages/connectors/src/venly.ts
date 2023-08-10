import { VenlyProvider, VenlyProviderOptions } from '@venly/web3-provider'
import type { Chain } from '@wagmi/chains'
import {
  SwitchChainError,
  UserRejectedRequestError,
  createWalletClient,
  custom,
  getAddress,
  numberToHex,
} from 'viem'

import { Connector } from './base'
import { ChainNotConfiguredForConnectorError } from './errors'
import type { WalletClient } from './types'
import { normalizeChainId } from './utils/normalizeChainId'

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

export class VenlyConnector extends Connector<VenlyProvider, Options> {
  readonly id = 'venly'
  readonly name = 'Venly'
  readonly ready = true

  client: VenlyProvider = new VenlyProvider()
  // client?: VenlyProvider
  provider: any

  constructor({ chains, options }: { chains?: Chain[]; options: Options }) {
    super({
      chains,
      options,
    })
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      if (!this.provider)
        this.provider = await this.client.createProvider(this.options)

      this.provider.on('accountsChanged', this.onAccountsChanged)
      this.provider.on('chainChanged', this.onChainChanged)
      this.provider.on('disconnect', this.onDisconnect)

      this.emit('message', { type: 'connecting' })

      const account = await this.getAccount()
      // Switch to chain if provided
      let id = await this.getChainId()
      let unsupported = this.isChainUnsupported(id)
      chainId = chainId ?? this.chains[0]?.id
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId)
        id = chain.id
        unsupported = this.isChainUnsupported(id)
      }

      return {
        account,
        chain: { id, unsupported },
      }
    } catch (error) {
      if (
        /(user closed modal|accounts received is empty)/i.test(
          (error as Error).message,
        )
      )
        throw new UserRejectedRequestError(error as Error)
      throw error
    }
  }

  async disconnect() {
    if (!this.provider) return

    await this.client.logout()
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

  async getWalletClient({ chainId }: { chainId?: number } = {}): Promise<WalletClient> {
    const provider = this.getProvider()
    const account = await this.getAccount()
    const chain = this.chains.find((x) => x.id === chainId)
    if (!provider) throw new Error('provider is required.')
    return createWalletClient({
      account,
      chain,
      transport: custom(provider),
    })
  }

  async isAuthorized() {
    try {
      this.provider = await this.client.createProvider({
        ...this.options,
        skipAuthentication: true,
      })
      const authResult = await this.client.checkAuthenticated()
      return authResult.isAuthenticated
    } catch {
      return false
    }
  }

  async switchChain(chainId: number) {
    const id = numberToHex(chainId)

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
        throw new ChainNotConfiguredForConnectorError({
          chainId,
          connectorId: this.id,
        })

      throw new SwitchChainError(error as Error)
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
}
