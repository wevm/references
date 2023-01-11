import { Chain, Ethereum, UserRejectedRequestError } from '@wagmi/core'
import { providers } from 'ethers'
import { getAddress } from 'ethers/lib/utils.js'

import { ConnectorData } from './base'
import { InjectedConnector, InjectedConnectorOptions } from './injected'

export class TrustWalletConnector extends InjectedConnector {
  readonly id = 'trustWallet'

  constructor({
    chains,
    options: options_,
  }: {
    chains?: Chain[]
    options?: InjectedConnectorOptions
  } = {}) {
    const options = {
      name: 'Trust Wallet',
      getProvider() {
        function isTrust(ethereum?: Ethereum) {
          const isTrustWallet = !!ethereum?.isTrust || !!ethereum?.isTrustWallet
          if (!isTrustWallet) return
          return ethereum
        }

        if (typeof window === 'undefined') return

        const provider =
          isTrust(window.ethereum) ||
          window.trustwallet ||
          window.ethereum?.providers?.find(isTrust)

        if (provider) {
          return provider
        }

        window.open('https://trustwallet.com/browser-extension/', '_blank')
      },
      ...options_,
    }
    super({ chains, options })
  }

  async connect(
    config?: { chainId?: number | undefined } | undefined,
  ): Promise<Required<ConnectorData<any>>> {
    try {
      const provider = await this.getProvider()
      let account: string

      provider.on('connect', this.connect)
      provider.on('accountsChanged', this.onAccountsChanged)
      provider.on('chainChanged', this.onChainChanged)
      provider.on('disconnect', this.onDisconnect)

      const id = await this.getChainId()
      const unsupported = this.isChainUnsupported(id)

      try {
        await provider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        })
        account = await this.getAccount()
      } catch (error) {
        if (this.isUserRejectedRequestError(error)) {
          throw new UserRejectedRequestError(error)
        }
      }

      if (!account) {
        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        })
        account = getAddress(accounts[0] as string)
      }

      if (config?.chainId && id !== config?.chainId) {
        this.switchChain(config.chainId)
      }

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(
          provider as unknown as providers.ExternalProvider,
        ),
      }
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error)
      }
      throw error
    }
  }
}
