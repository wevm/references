import { describe, expect, it } from 'vitest'

import type { Ethereum } from '../types'
import { getInjectedName } from './getInjectedName'

describe.each([
  { ethereum: undefined, expected: 'Injected' },
  { ethereum: { isApexWallet: true }, expected: 'Apex Wallet' },
  {
    ethereum: { isApexWallet: true, isMetaMask: true },
    expected: 'Apex Wallet',
  },
  { ethereum: { isAvalanche: true }, expected: 'Core Wallet' },
  {
    ethereum: { isAvalanche: true, isMetaMask: true },
    expected: 'Core Wallet',
  },
  { ethereum: { isBackpack: true }, expected: 'Backpack' },
  { ethereum: { isBifrost: true }, expected: 'Bifrost Wallet' },
  { ethereum: { isBitKeep: true }, expected: 'BitKeep' },
  { ethereum: { isBitski: true }, expected: 'Bitski' },
  { ethereum: { isBraveWallet: true }, expected: 'Brave Wallet' },
  {
    ethereum: { isBraveWallet: true, isMetaMask: true },
    expected: 'Brave Wallet',
  },
  { ethereum: { isCoinbaseWallet: true }, expected: 'Coinbase Wallet' },
  { ethereum: { isDawn: true }, expected: 'Dawn Wallet' },
  { ethereum: { isExodus: true }, expected: 'Exodus' },
  { ethereum: { isFrame: true }, expected: 'Frame' },
  { ethereum: { isFrontier: true }, expected: 'Frontier Wallet' },
  { ethereum: { isGamestop: true }, expected: 'GameStop Wallet' },
  { ethereum: { isHyperPay: true }, expected: 'HyperPay Wallet' },
  { ethereum: { isKuCoinWallet: true }, expected: 'KuCoin Wallet' },
  {
    ethereum: { isKuCoinWallet: true, isMetaMask: true },
    expected: 'KuCoin Wallet',
  },
  {
    ethereum: { isMathWallet: true, isMetaMask: true },
    expected: 'MathWallet',
  },
  { ethereum: { isOneInchIOSWallet: true }, expected: '1inch Wallet' },
  { ethereum: { isOneInchAndroidWallet: true }, expected: '1inch Wallet' },
  { ethereum: { isPhantom: true }, expected: 'Phantom' },
  { ethereum: { isPhantom: true, isMetaMask: true }, expected: 'Phantom' },
  { ethereum: { isPortal: true }, expected: 'Ripio Portal' },
  { ethereum: { isRainbow: true }, expected: 'Rainbow' },
  { ethereum: { isStatus: true }, expected: 'Status' },
  { ethereum: { isTally: true }, expected: 'Tally' },
  {
    ethereum: { isTokenPocket: true, isMetaMask: true },
    expected: 'TokenPocket',
  },
  { ethereum: { isTokenary: true, isMetaMask: true }, expected: 'Tokenary' },
  { ethereum: { isTrust: true }, expected: 'Trust Wallet' },
  { ethereum: { isTrustWallet: true }, expected: 'Trust Wallet' },
  { ethereum: { isXDEFI: true }, expected: 'XDEFI Wallet' },
  { ethereum: { isZerion: true }, expected: 'Zerion' },
  { ethereum: { isMetaMask: true }, expected: 'MetaMask' },
  {
    ethereum: { providers: [{ isMetaMask: true }, { isCoinbaseWallet: true }] },
    expected: ['MetaMask', 'Coinbase Wallet'],
  },
  {
    ethereum: {
      providers: [
        { isMetaMask: true },
        { isMetaMask: true, isTokenary: true },
        { isCoinbaseWallet: true },
      ],
    },
    expected: ['MetaMask', 'Tokenary', 'Coinbase Wallet'],
  },
  {
    ethereum: { providers: [{ isMetaMask: true }, { isFooWallet: true }, {}] },
    expected: ['MetaMask', 'Unknown Wallet #1', 'Unknown Wallet #2'],
  },
  { ethereum: {}, expected: 'Injected' },
])('getInjectedName($ethereum)', ({ ethereum, expected }) => {
  it(`returns ${expected}`, () => {
    expect(getInjectedName(ethereum as Ethereum)).toEqual(expected)
  })
})
