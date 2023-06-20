import {
  Account,
  Chain,
  EIP1193Provider,
  Transport,
  WalletClient as WalletClient_,
} from 'viem'

import { ConnectorData } from './base'

type InjectedProviderFlags = {
  isApexWallet?: true
  isAvalanche?: true
  isBackpack?: true
  isBifrost?: true
  isBitKeep?: true
  isBitski?: true
  isBlockWallet?: true
  isBraveWallet?: true
  isCoinbaseWallet?: true
  isDawn?: true
  isDefiant?: true
  isEnkrypt?: true
  isExodus?: true
  isFrame?: true
  isFrontier?: true
  isGamestop?: true
  isHyperPay?: true
  isImToken?: true
  isKuCoinWallet?: true
  isMathWallet?: true
  isMetaMask?: true
  isNovaWallet?: true
  isOkxWallet?: true
  isOKExWallet?: true
  isOneInchAndroidWallet?: true
  isOneInchIOSWallet?: true
  isOpera?: true
  isPhantom?: true
  isPortal?: true
  isRabby?: true
  isRainbow?: true
  isStatus?: true
  isTalisman?: true
  isTally?: true
  isTokenPocket?: true
  isTokenary?: true
  isTrust?: true
  isTrustWallet?: true
  isTTWallet?: true
  isXDEFI?: true
  isZerion?: true
  isHaloWallet?: true
}

type InjectedProviders = InjectedProviderFlags & {
  isMetaMask: true
  /** Only exists in MetaMask as of 2022/04/03 */
  _events: {
    connect?: () => void
  }
  /** Only exists in MetaMask as of 2022/04/03 */
  _state?: {
    accounts?: string[]
    initialized?: boolean
    isConnected?: boolean
    isPermanentlyDisconnected?: boolean
    isUnlocked?: boolean
  }
}

export interface WindowProvider extends InjectedProviders, EIP1193Provider {
  providers?: WindowProvider[]
}

export type WalletClient<
  TTransport extends Transport = Transport,
  TChain extends Chain = Chain,
  TAccount extends Account = Account,
> = WalletClient_<TTransport, TChain, TAccount>

export type Storage = {
  getItem<T>(key: string, defaultState?: T | null): T | null
  setItem<T>(key: string, value: T | null): void
  removeItem(key: string): void
}

export type StorageStoreData = {
  state: { data?: ConnectorData }
}
