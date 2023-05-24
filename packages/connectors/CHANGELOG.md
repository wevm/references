# @wagmi/connectors

## 1.0.5

### Patch Changes

- fa61dfe: Updated viem.
- Updated dependencies [577d2a0]
  - @wagmi/chains@0.2.25

## 1.0.4

### Patch Changes

- bbbd11b: Corrected Rabby Wallet name
- Updated dependencies [0639a1f]
  - @wagmi/chains@0.2.24

## 1.0.3

### Patch Changes

- 64dfe61: Update @web3modal/standalone to v2.4.1, Update @walletconnect/ethereum-provider to 2.7.4
- bab7ad8: Added Defiant to injected connector flags
- 44cde07: Added Talisman wallet flag

## 1.0.2

### Patch Changes

- bce5a0c: Removed chain fallback when instantiating a Wallet Client.

## 1.0.1

### Patch Changes

- [`ea651cd7`](https://github.com/wagmi-dev/wagmi/commit/ea651cd7fc75b7866272605467db11fd6e1d81af) Thanks [@jxom](https://github.com/jxom)! - Downgraded abitype.

## 1.0.0

### Major Changes

- 7e274f5: Released v1.

### Patch Changes

- 0966bf7: Changed Kucoin Wallet name mapping to Halo Wallet

## 1.0.0-next.5

### Major Changes

- Updated references.

## 1.0.0-next.4

### Major Changes

- Updated references.

## 1.0.0-next.3

### Patch Changes

- Updated dependencies []:
  - @wagmi/chains@1.0.0-next.0

## 1.0.0-next.2

### Major Changes

- updated viem

## 1.0.0-next.1

### Major Changes

- [`a7dda00c`](https://github.com/wagmi-dev/wagmi/commit/a7dda00c5b546f8b2c42b527e4d9ac1b9e9ab1fb) Thanks [@jxom](https://github.com/jxom)! - Released v1.

## 1.0.0-next.0

### Major Changes

- 33488cf: Released v1.

## 0.3.19

### Patch Changes

- 274eef3: - Updated @web3modal/standalone to 2.3.7
  - Updated @walletconnect/ethereum-provider to 2.7.1
- 41697df: Updated @walletconnect/ethereum-provider version to 2.7.2
- 82dcb72: Added Enkrypt extension detection

## 0.3.18

### Patch Changes

- f66e065: Added BlockWallet to injected connector flags.

## 0.3.17

### Patch Changes

- 12ab5d1: Updated @coinbase/wallet-sdk to 3.6.6

## 0.3.16

### Patch Changes

- c1e3ddf: Reverted ABIType version change.

## 0.3.15

### Patch Changes

- d4825e6: Fixed ABIType version to match downstream packages.

## 0.3.14

### Patch Changes

- c25ac82: Added more flags to `MetaMaskConnector` `getProvider` check.
- b19a932: Updated @web3modal/standalone to 2.3.0, @walletconnect/ethereum-provider to 2.7.0
- cdc387e: Added `ImToken` to `getInjectedName` list

## 0.3.13

### Patch Changes

- 2a21d27: Updated `@coinbase/wallet-sdk` to `3.6.4`

## 0.3.12

### Patch Changes

- 9bb22b6: Updated `@walletconnect/ethereum-provider` to `2.6.2`, relaxed `@web3modal/standalone` version requirement
- 0d7625b: Added Rabby to injected connector flags
- f63d7fd: Added correct error to switch network cause.

## 0.3.11

### Patch Changes

- 0778abc: Renamed `isTally` injected provider to `Taho`

## 0.3.10

### Patch Changes

- 4267020: Added `qrModalOptions` option to `WalletConnectConnector`
- e78fb0a: Pinned WalletConnect dependencies

## 0.3.9

### Patch Changes

- 5cd0afc: Added `isZerion` to `InjectedProviderFlags` and `getInjectedName`
- be4825e: Added GameStop Wallet to injected connector flags

## 0.3.8

### Patch Changes

- 11f3fe2: Fixed issue where `UNSTABLE_shimOnConnectSelectAccount` would not bubble up error for MetaMask if request to connect was already active.

## 0.3.7

### Patch Changes

- 04c0e47: Fixed issue switching chain after adding to MetaMask.

## 0.3.6

### Patch Changes

- 85330c1: Removed `InjectedConnector` `shimChainChangedDisconnect` shim (no longer necessary).

## 0.3.5

### Patch Changes

- 8b1a526: Added Dawn wallet flag

## 0.3.4

### Patch Changes

- 6b15d6f: Updated `@walletconnect/ethereum-provider` to `2.5.1`.
- 1f452e7: Added OKX Wallet to injected connector flags.
- a4d9083: Added Backpack wallet to injected connector flags.
- 6a4af48: Enabled support for programmatic chain switching on `LedgerConnector` & added `"ledger"` to the switch chain regex on `WalletConnectLegacyConnector`.

## 0.3.3

### Patch Changes

- f24ce0c: Updated @walletconnect/ethereum-provider to 2.4.8
- e3a3fee: Added "uniswap wallet" to the regex that determines wallets allowed to switch chains in the WalletConnect legacy connector
- 641af48: Added name mapping for Bifrost Wallet
- 4d2c90a: Added name mapping for Phantom
- 3d276d0: Added Status as the name of the injected connector for the Status App

## 0.3.2

### Patch Changes

- 13a6a07: Updated `@walletconnect/ethereum-provider` to `2.4.7`.

## 0.3.1

### Patch Changes

- a23c40f: Added name mapping for [Frontier](https://frontier.xyz) Wallet
- d779fb3: Added name mapping for HyperPay.

## 0.3.0

### Minor Changes

- c4d5bb5: **Breaking:** Removed the `version` config option for `WalletConnectConnector`.

  `WalletConnectConnector` now uses WalletConnect v2 by default. WalletConnect v1 is now `WalletConnectLegacyConnector`.

  ### WalletConnect v2

  ```diff
  import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'

  const connector = new WalletConnectConnector({
    options: {
  -   version: '2',
      projectId: 'abc',
    },
  })
  ```

  ### WalletConnect v1

  ```diff
  -import { WalletConnectConnector } from '@wagmi/connectors/walletConnect'
  +import { WalletConnectLegacyConnector } from '@wagmi/connectors/walletConnectLegacy'

  -const connector = new WalletConnectConnector({
  +const connector = new WalletConnectLegacyConnector({
    options: {
      qrcode: true,
    },
  })
  ```

## 0.2.7

### Patch Changes

- 57f1226: Added name mapping for XDEFI

## 0.2.6

### Patch Changes

- bb1b88c: Added name mapping for Bitski injected wallet
- fcb5595: Fixed shim disconnect key to read from defined Connector ID.
- 49f8853: Fixed `SafeConnector` import type error that existed for specific build environments.

## 0.2.5

### Patch Changes

- 5d121f2: Added `isApexWallet` to injected `window.ethereum` flags.
- e3566eb: Updated `@web3modal/standalone` to `2.1.1` for WalletConnectConnector.

## 0.2.4

### Patch Changes

- a4f31bc: Added Connector for [Safe](https://safe.global) wallet
- d5e25d9: Locked ethers peer dependency version to >=5.5.1 <6

## 0.2.3

### Patch Changes

- 6fa74dd: Updated `@walletconnect/universal-provider`
  Added more signable methods to WC v2.

## 0.2.2

### Patch Changes

- 6b0725b: Fixed race condition between `switchNetwork` and mutation Hooks that use `chainId` (e.g. `sendTransaction`).

## 0.2.1

### Patch Changes

- 942fcde: Updated `@walletconnect/universal-provider` and `@web3modal/standalone` packages for WalletConnectConnector (v2).

  Improved initialization flow for `@walletconnect/universal-provider` for WalletConnectConnector (v2).

## 0.2.0

### Minor Changes

- be33c7d: Chains are now narrowed to their most specific type using the TypeScript [`satisfies`](https://devblogs.microsoft.com/typescript/announcing-typescript-4-9/#the-satisfies-operator) operator.

## 0.1.10

### Patch Changes

- d75e8d2: Fixed ABIType version mismatch between packages.

## 0.1.9

### Patch Changes

- 8c3fc00: Added public RPC URL to Connector fallback chains

## 0.1.8

### Patch Changes

- 5e6dc30: Replaced legacy qrcodemodal with web3modal for WalletConnect v2.

## 0.1.7

### Patch Changes

- be4add2: Added `isRainbow` flag to `InjectedConnector`.

## 0.1.6

### Patch Changes

- 3dfc558: Add `switchSigner` method to `MockProvider`.

## 0.1.5

### Patch Changes

- 7dce4b5: Bumped WalletConnect Universal Provider version.

## 0.1.4

### Patch Changes

- 4cec598: Added CJS escape hatch bundle under the "cjs" tag.

## 0.1.3

### Patch Changes

- 822bc88: The `WalletConnectConnector` now supports WalletConnect v2.

  It can be enabled by setting `version` to `'2'` and supplying a [WalletConnect Cloud `projectId`](https://cloud.walletconnect.com/sign-in).

## 0.1.2

### Patch Changes

- 5e5f37f: Fixed issue where connecting to MetaMask may return with a stale address

## 0.1.1

### Patch Changes

- 919790c: Updated `@ledgerhq/connect-kit-loader` to `1.0.1`

## 0.1.0

### Minor Changes

- 5db7cba: Added `LedgerConnector`
- 55a0ca2: Initial release of the `@wagmi/connectors` package – a collection of Connectors for wagmi.
