import type {
  CoinbaseWalletProvider,
  CoinbaseWalletSDK,
} from '@coinbase/wallet-sdk'
import type { CoinbaseWalletSDKOptions } from '@coinbase/wallet-sdk/dist/CoinbaseWalletSDK'
import type { Chain } from '@wagmi/chains'
import type { Address } from 'abitype'
import {
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  createWalletClient,
  custom,
  getAddress,
  numberToHex,
} from 'viem'

import { Connector } from './base'
import { ChainNotConfiguredForConnectorError } from './errors'
import { normalizeChainId } from './utils/normalizeChainId'

type Options = Omit<CoinbaseWalletSDKOptions, 'reloadOnDisconnect'> & {
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

export class CoinbaseWalletConnector extends Connector<
  CoinbaseWalletProvider,
  Options
> {
  readonly id = 'coinbaseWallet'
  readonly name = 'Coinbase Wallet'
  readonly ready = true

  #client?: CoinbaseWalletSDK
  #provider?: CoinbaseWalletProvider

  constructor({ chains, options }: { chains?: Chain[]; options: Options }) {
    super({
      chains,
      options: {
        reloadOnDisconnect: false,
        ...options,
      },
    })
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    try {
      const provider = await this.getProvider()
      provider.on('accountsChanged', this.onAccountsChanged)
      provider.on('chainChanged', this.onChainChanged)
      provider.on('disconnect', this.onDisconnect)

      this.emit('message', { type: 'connecting' })

      const accounts = await provider.enable()
      const account = getAddress(accounts[0] as string)
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
    if (!this.#provider) return

    const provider = await this.getProvider()
    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)
    provider.disconnect()
    provider.close()
  }

  async getAccount() {
    const provider = await this.getProvider()
    const accounts = await provider.request<Address[]>({
      method: 'eth_accounts',
    })
    // return checksum address
    return getAddress(accounts[0] as string)
  }

  async getChainId() {
    const provider = await this.getProvider()
    const chainId = normalizeChainId(provider.chainId)
    return chainId
  }

  async getProvider() {
    if (!this.#provider) {
      let CoinbaseWalletSDK = (await import('@coinbase/wallet-sdk')).default
      // Workaround for Vite dev import errors
      // https://github.com/vitejs/vite/issues/7112
      if (
        typeof CoinbaseWalletSDK !== 'function' &&
        // @ts-expect-error This import error is not visible to TypeScript
        typeof CoinbaseWalletSDK.default === 'function'
      )
        CoinbaseWalletSDK = (
          CoinbaseWalletSDK as unknown as { default: typeof CoinbaseWalletSDK }
        ).default
      this.#client = new CoinbaseWalletSDK(this.options)

      /**
       * Mock implementations to retrieve private `walletExtension` method
       * from the Coinbase Wallet SDK.
       */
      abstract class WalletProvider {
        // https://github.com/coinbase/coinbase-wallet-sdk/blob/b4cca90022ffeb46b7bbaaab9389a33133fe0844/packages/wallet-sdk/src/provider/CoinbaseWalletProvider.ts#L927-L936
        abstract getChainId(): number
      }
      abstract class Client {
        // https://github.com/coinbase/coinbase-wallet-sdk/blob/b4cca90022ffeb46b7bbaaab9389a33133fe0844/packages/wallet-sdk/src/CoinbaseWalletSDK.ts#L233-L235
        abstract get walletExtension(): WalletProvider | undefined
      }
      const walletExtensionChainId = (
        this.#client as unknown as Client
      ).walletExtension?.getChainId()

      const chain =
        this.chains.find((chain) =>
          this.options.chainId
            ? chain.id === this.options.chainId
            : chain.id === walletExtensionChainId,
        ) || this.chains[0]
      const chainId = this.options.chainId || chain?.id
      const jsonRpcUrl =
        this.options.jsonRpcUrl || chain?.rpcUrls.default.http[0]

      this.#provider = this.#client.makeWeb3Provider(jsonRpcUrl, chainId)
    }
    return this.#provider
  }

  async getWalletClient({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount(),
    ])
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
      const account = await this.getAccount()
      return !!account
    } catch {
      return false
    }
  }

  async switchChain(chainId: number) {
    const provider = await this.getProvider()
    const id = numberToHex(chainId)

    try {
      await provider.request({
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

      // Indicates chain is not added to provider
      if ((error as ProviderRpcError).code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: id,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: [chain.rpcUrls.public?.http[0] ?? ''],
                blockExplorerUrls: this.getBlockExplorerUrls(chain),
              },
            ],
          })
          return chain
        } catch (error) {
          throw new UserRejectedRequestError(error as Error)
        }
      }

      throw new SwitchChainError(error as Error)
    }
  }

  async watchAsset({
    address,
    decimals = 18,
    image,
    symbol,
  }: {
    address: string
    decimals?: number
    image?: string
    symbol: string
  }) {
    const provider = await this.getProvider()
    return provider.request<boolean>({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address,
          decimals,
          image,
          symbol,
        },
      },
    })
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
