import {
  Chain,
  ConnectorNotFoundError,
  Ethereum,
  UserRejectedRequestError,
} from '@wagmi/core'
import { Address } from 'abitype'
import { getAddress } from 'ethers/lib/utils.js'

import { InjectedConnector, InjectedConnectorOptions } from './injected'

type Window = typeof window & {
  trustwallet: Ethereum
  ethereum: Ethereum
}

export class TrustWalletConnector extends InjectedConnector {
  readonly id = 'trustWallet'
  readonly ready = true

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

        return (
          isTrust(window.ethereum) ||
          (window as Window).trustwallet ||
          window.ethereum?.providers?.find(isTrust)
        )
      },
      ...options_,
    }
    super({ chains, options })
  }

  async connect(config?: { chainId?: number | undefined } | undefined) {
    try {
      const provider = await this.getProvider()

      if (!provider) {
        window.open('https://trustwallet.com/browser-extension/', '_blank')
        throw new ConnectorNotFoundError()
      }

      let account: Address | null = null

      if (provider.on) {
        provider.on('connect', this.connect)
        provider.on('accountsChanged', this.onAccountsChanged)
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect)
      }

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
        provider,
      }
    } catch (error) {
      if (this.isUserRejectedRequestError(error)) {
        throw new UserRejectedRequestError(error)
      }
      throw error
    }
  }
}
