import {
  SupportedProviders,
  loadConnectKit,
} from '@ledgerhq/connect-kit-loader'
import type { EthereumProvider } from '@ledgerhq/connect-kit-loader'
import {
  Chain,
  ProviderRpcError,
  RpcError,
  UserRejectedRequestError,
  normalizeChainId,
} from '@wagmi/core'
import { providers } from 'ethers'
import { getAddress } from 'ethers/lib/utils.js'

import type { ConnectorData } from './base'
import { Connector } from './base'

type LedgerConnectorOptions = {
  bridge?: string
  chainId?: number
  enableDebugLogs?: boolean
  rpc?: { [chainId: number]: string }
}

type LedgerSigner = providers.JsonRpcSigner

export class LedgerConnector extends Connector<
  EthereumProvider,
  LedgerConnectorOptions,
  LedgerSigner
> {
  readonly id = 'ledger'
  readonly name = 'Ledger'
  readonly ready = true

  #provider?: EthereumProvider

  constructor({
    chains,
    options = { enableDebugLogs: false },
  }: {
    chains?: Chain[]
    options?: LedgerConnectorOptions
  } = {}) {
    super({ chains, options })
  }

  async connect(): Promise<Required<ConnectorData>> {
    try {
      const provider = await this.getProvider({ create: true })

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

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(
          provider as providers.ExternalProvider,
        ),
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

    if (provider?.disconnect) {
      await provider.disconnect()
    }

    if (provider?.removeListener) {
      provider.removeListener('accountsChanged', this.onAccountsChanged)
      provider.removeListener('chainChanged', this.onChainChanged)
      provider.removeListener('disconnect', this.onDisconnect)
    }

    typeof localStorage !== 'undefined' &&
      localStorage.removeItem('walletconnect')
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

  async getProvider(
    { chainId, create }: { chainId?: number; create?: boolean } = {
      create: false,
    },
  ) {
    if (!this.#provider || chainId || create) {
      const connectKit = await loadConnectKit()

      if (this.options.enableDebugLogs) {
        connectKit.enableDebugLogs()
      }

      const rpc = this.chains.reduce(
        (rpc, chain) => ({
          ...rpc,
          [chain.id]: chain.rpcUrls.default.http[0],
        }),
        {},
      )

      connectKit.checkSupport({
        bridge: this.options.bridge,
        providerType: SupportedProviders.Ethereum,
        chainId: chainId || this.options.chainId,
        rpc: { ...rpc, ...this.options?.rpc },
      })

      this.#provider = (await connectKit.getProvider()) as EthereumProvider
    }
    return this.#provider
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
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
