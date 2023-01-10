# @wagmi/connectors

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
